import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const complaint = await prisma.complaint.findUnique({
            where: { id },
            include: {
                department: {
                    select: { id: true, name: true, icon: true, color: true },
                },
                citizen: {
                    select: { id: true, name: true, email: true },
                },
                city: {
                    select: { id: true, name: true, district: { select: { name: true, state: { select: { name: true } } } } },
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
                        department: {
                            select: { name: true },
                        },
                    },
                },
                statusLogs: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        authority: {
                            select: {
                                designation: true,
                                user: { select: { name: true } },
                            },
                        },
                    },
                },
                satisfactionRating: true,
            },
        })

        if (!complaint) {
            return NextResponse.json(
                { error: "Complaint not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(complaint)
    } catch (error) {
        console.error("Error fetching complaint:", error)
        return NextResponse.json(
            { error: "Failed to fetch complaint" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { status, notes } = body

        // Verify authority or admin
        if (session.user.role !== "ADMIN" && session.user.role !== "AUTHORITY") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const complaint = await prisma.complaint.findUnique({
            where: { id },
            include: { assignedAuthority: true },
        })

        if (!complaint) {
            return NextResponse.json(
                { error: "Complaint not found" },
                { status: 404 }
            )
        }

        // Check if authority is assigned to this complaint
        if (
            session.user.role === "AUTHORITY" &&
            session.user.authorityId !== complaint.assignedAuthorityId
        ) {
            return NextResponse.json(
                { error: "You are not assigned to this complaint" },
                { status: 403 }
            )
        }

        // Update complaint status
        const updateData: Record<string, unknown> = { status, updatedAt: new Date() }

        if (status === "VIEWED" && !complaint.viewedAt) {
            updateData.viewedAt = new Date()
        } else if (status === "RESOLVED") {
            updateData.resolvedAt = new Date()

            // Update authority metrics
            if (complaint.assignedAuthorityId) {
                await prisma.authority.update({
                    where: { id: complaint.assignedAuthorityId },
                    data: {
                        resolvedComplaints: { increment: 1 },
                        pendingComplaints: { decrement: 1 },
                    },
                })
            }
        } else if (status === "CLOSED") {
            updateData.closedAt = new Date()
        }

        const updatedComplaint = await prisma.complaint.update({
            where: { id },
            data: updateData,
        })

        // Create status log
        await prisma.complaintStatusLog.create({
            data: {
                complaintId: id,
                status,
                notes,
                authorityId: session.user.authorityId || undefined,
            },
        })

        return NextResponse.json({
            message: "Complaint updated successfully",
            complaint: updatedComplaint,
        })
    } catch (error) {
        console.error("Error updating complaint:", error)
        return NextResponse.json(
            { error: "Failed to update complaint" },
            { status: 500 }
        )
    }
}
