import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { generateTicketNumber } from "@/lib/utils"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const { searchParams } = new URL(request.url)

        const status = searchParams.get("status")
        const departmentId = searchParams.get("departmentId")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const ticketNumber = searchParams.get("ticketNumber")

        // Build where clause
        const where: Record<string, unknown> = {}

        // If ticket number is provided, search by it (public access)
        if (ticketNumber) {
            where.ticketNumber = ticketNumber
        } else if (session) {
            // Otherwise, filter by user role
            if (session.user.role === "CITIZEN") {
                where.citizenId = session.user.id
            } else if (session.user.role === "AUTHORITY" && session.user.authorityId) {
                where.assignedAuthorityId = session.user.authorityId
            }
            // ADMIN can see all complaints
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (status) where.status = status
        if (departmentId) where.departmentId = departmentId

        const [complaints, total] = await Promise.all([
            prisma.complaint.findMany({
                where,
                include: {
                    department: {
                        select: { id: true, name: true, icon: true, color: true },
                    },
                    city: {
                        select: { id: true, name: true },
                    },
                    ward: {
                        select: { id: true, number: true, name: true },
                    },
                    assignedAuthority: {
                        select: {
                            id: true,
                            designation: true,
                            level: true,
                            user: {
                                select: { name: true, email: true },
                            },
                        },
                    },
                    statusLogs: {
                        orderBy: { createdAt: "desc" },
                        take: 5,
                        include: {
                            authority: {
                                select: {
                                    designation: true,
                                    user: { select: { name: true } },
                                },
                            },
                        },
                    },
                    satisfactionRating: {
                        select: { rating: true, feedback: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.complaint.count({ where }),
        ])

        return NextResponse.json({
            complaints,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching complaints:", error)
        return NextResponse.json(
            { error: "Failed to fetch complaints" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const {
            title,
            description,
            departmentId,
            cityId,
            wardId,
            address,
            pincode,
            priority = "MEDIUM",
            evidenceUrls = [],
        } = body

        // Validate required fields
        if (!title || !description || !departmentId || !cityId) {
            return NextResponse.json(
                { error: "Title, description, department, and city are required" },
                { status: 400 }
            )
        }

        // Generate unique ticket number
        const ticketNumber = generateTicketNumber()

        // Find appropriate authority for the location and department
        let assignedAuthority = null

        // Auto-map constituencies based on ward
        let assemblyConstituencyId = null
        let parliamentaryConstituencyId = null

        // Try to find ward-level authority first
        if (wardId) {
            // Get ward with constituency mapping
            const ward = await prisma.ward.findUnique({
                where: { id: wardId },
                select: {
                    assemblyConstituencyId: true,
                    parliamentaryConstituencyId: true,
                }
            })

            if (ward) {
                assemblyConstituencyId = ward.assemblyConstituencyId
                parliamentaryConstituencyId = ward.parliamentaryConstituencyId
            }

            assignedAuthority = await prisma.authority.findFirst({
                where: {
                    departmentId,
                    wardId,
                    isActive: true,
                },
                orderBy: { level: "asc" },
            })
        }

        // If no ward-level authority, try city-level
        if (!assignedAuthority) {
            const city = await prisma.city.findUnique({
                where: { id: cityId },
                include: { district: true },
            })

            if (city) {
                assignedAuthority = await prisma.authority.findFirst({
                    where: {
                        departmentId,
                        OR: [
                            { cityId: cityId },
                            { districtId: city.districtId },
                        ],
                        isActive: true,
                    },
                    orderBy: { level: "asc" },
                })
            }
        }

        // Get escalation days for this department
        const escalationRule = await prisma.escalationRule.findFirst({
            where: {
                departmentId,
                fromLevel: 1,
                isActive: true,
            },
        })

        const daysToEscalate = escalationRule?.daysToEscalate || 7
        const escalationDueAt = new Date()
        escalationDueAt.setDate(escalationDueAt.getDate() + daysToEscalate)

        // Create complaint with constituency mapping
        const complaint = await prisma.complaint.create({
            data: {
                ticketNumber,
                title,
                description,
                departmentId,
                citizenId: session.user.id,
                cityId,
                wardId: wardId || null,
                address,
                pincode,
                priority,
                evidenceUrls,
                assignedAuthorityId: assignedAuthority?.id || null,
                assemblyConstituencyId,
                parliamentaryConstituencyId,
                currentEscalationLevel: 1,
                escalationDueAt,
            },
            include: {
                department: {
                    select: { name: true },
                },
                city: {
                    select: { name: true },
                },
                assignedAuthority: {
                    select: {
                        designation: true,
                        user: { select: { name: true } },
                    },
                },
                assemblyConstituency: {
                    select: { id: true, name: true },
                },
                parliamentaryConstituency: {
                    select: { id: true, name: true },
                },
            },
        })

        // Create initial status log
        await prisma.complaintStatusLog.create({
            data: {
                complaintId: complaint.id,
                status: "SUBMITTED",
                notes: "Complaint registered successfully",
            },
        })

        // Update authority's pending complaints count
        if (assignedAuthority) {
            await prisma.authority.update({
                where: { id: assignedAuthority.id },
                data: {
                    pendingComplaints: { increment: 1 },
                    totalComplaints: { increment: 1 },
                },
            })
        }

        return NextResponse.json(
            {
                message: "Complaint registered successfully",
                complaint,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating complaint:", error)
        return NextResponse.json(
            { error: "Failed to create complaint" },
            { status: 500 }
        )
    }
}
