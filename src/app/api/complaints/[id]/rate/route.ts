import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(
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
        const { rating, feedback } = body

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            )
        }

        const complaint = await prisma.complaint.findUnique({
            where: { id },
            include: { satisfactionRating: true },
        })

        if (!complaint) {
            return NextResponse.json(
                { error: "Complaint not found" },
                { status: 404 }
            )
        }

        // Verify the citizen owns this complaint
        if (complaint.citizenId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Check if complaint is resolved or closed
        if (!["RESOLVED", "CLOSED"].includes(complaint.status)) {
            return NextResponse.json(
                { error: "Can only rate resolved or closed complaints" },
                { status: 400 }
            )
        }

        // Check if already rated
        if (complaint.satisfactionRating) {
            return NextResponse.json(
                { error: "Complaint already rated" },
                { status: 400 }
            )
        }

        // Create satisfaction rating
        const satisfactionRating = await prisma.satisfactionRating.create({
            data: {
                complaintId: id,
                citizenId: session.user.id,
                authorityId: complaint.assignedAuthorityId!,
                rating,
                feedback: feedback || null,
            },
        })

        // Update complaint status to closed if resolved
        if (complaint.status === "RESOLVED") {
            await prisma.complaint.update({
                where: { id },
                data: { status: "CLOSED", closedAt: new Date() },
            })

            await prisma.complaintStatusLog.create({
                data: {
                    complaintId: id,
                    status: "CLOSED",
                    notes: `Closed by citizen after providing satisfaction rating of ${rating}/5`,
                },
            })
        }

        // Update authority performance metrics
        if (complaint.assignedAuthorityId) {
            const allRatings = await prisma.satisfactionRating.findMany({
                where: { authorityId: complaint.assignedAuthorityId },
                select: { rating: true },
            })

            const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length

            const authority = await prisma.authority.findUnique({
                where: { id: complaint.assignedAuthorityId },
            })

            if (authority) {
                const resolutionRate = authority.totalComplaints > 0
                    ? (authority.resolvedComplaints / authority.totalComplaints) * 100
                    : 0

                // Performance score = (avgRating * 20) * 0.5 + resolutionRate * 0.5
                const performanceScore = (avgRating * 20) * 0.5 + resolutionRate * 0.5

                await prisma.authority.update({
                    where: { id: complaint.assignedAuthorityId },
                    data: { performanceScore },
                })
            }
        }

        return NextResponse.json({
            message: "Rating submitted successfully",
            satisfactionRating,
        })
    } catch (error) {
        console.error("Error creating rating:", error)
        return NextResponse.json(
            { error: "Failed to submit rating" },
            { status: 500 }
        )
    }
}
