import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// This endpoint can be called by a cron job or queue system
// For security, you should add an API key or authorization header
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization")
        const cronSecret = process.env.CRON_SECRET

        // Verify cron secret if configured
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const now = new Date()

        // Find complaints that are due for escalation
        const complaintsToEscalate = await prisma.complaint.findMany({
            where: {
                status: {
                    in: ["SUBMITTED", "VIEWED", "IN_PROGRESS"],
                },
                escalationDueAt: {
                    lte: now,
                },
            },
            include: {
                department: true,
                assignedAuthority: true,
            },
        })

        const results = {
            processed: 0,
            escalated: 0,
            errors: 0,
        }

        for (const complaint of complaintsToEscalate) {
            try {
                // Find the next escalation rule
                const escalationRule = await prisma.escalationRule.findFirst({
                    where: {
                        departmentId: complaint.departmentId,
                        fromLevel: complaint.currentEscalationLevel,
                        isActive: true,
                    },
                })

                if (!escalationRule) {
                    // No further escalation available
                    results.processed++
                    continue
                }

                // Find the next authority at the higher level
                const nextAuthority = await prisma.authority.findFirst({
                    where: {
                        departmentId: complaint.departmentId,
                        level: escalationRule.toLevel,
                        isActive: true,
                        // Try to find in same jurisdiction hierarchy
                        OR: [
                            { wardId: complaint.wardId },
                            { cityId: complaint.cityId },
                            { districtId: { not: null } }, // District or higher level
                        ],
                    },
                    orderBy: { level: "asc" },
                })

                if (nextAuthority) {
                    // Update the previous authority's metrics
                    if (complaint.assignedAuthorityId) {
                        await prisma.authority.update({
                            where: { id: complaint.assignedAuthorityId },
                            data: {
                                pendingComplaints: { decrement: 1 },
                            },
                        })
                    }

                    // Calculate next escalation due date
                    const nextEscalationRule = await prisma.escalationRule.findFirst({
                        where: {
                            departmentId: complaint.departmentId,
                            fromLevel: escalationRule.toLevel,
                            isActive: true,
                        },
                    })

                    const nextEscalationDueAt = new Date()
                    nextEscalationDueAt.setDate(
                        nextEscalationDueAt.getDate() + (nextEscalationRule?.daysToEscalate || 7)
                    )

                    // Update complaint
                    await prisma.complaint.update({
                        where: { id: complaint.id },
                        data: {
                            status: "ESCALATED",
                            assignedAuthorityId: nextAuthority.id,
                            currentEscalationLevel: escalationRule.toLevel,
                            escalationDueAt: nextEscalationDueAt,
                        },
                    })

                    // Update new authority's metrics
                    await prisma.authority.update({
                        where: { id: nextAuthority.id },
                        data: {
                            pendingComplaints: { increment: 1 },
                            totalComplaints: { increment: 1 },
                        },
                    })

                    // Create status log
                    await prisma.complaintStatusLog.create({
                        data: {
                            complaintId: complaint.id,
                            status: "ESCALATED",
                            notes: `Automatically escalated from Level ${escalationRule.fromLevel} to Level ${escalationRule.toLevel} due to no resolution within ${escalationRule.daysToEscalate} days`,
                        },
                    })

                    results.escalated++
                }

                results.processed++
            } catch (error) {
                console.error(`Error escalating complaint ${complaint.id}:`, error)
                results.errors++
            }
        }

        return NextResponse.json({
            message: "Escalation check completed",
            results,
        })
    } catch (error) {
        console.error("Error in escalation cron:", error)
        return NextResponse.json(
            { error: "Failed to process escalations" },
            { status: 500 }
        )
    }
}

// GET endpoint to check escalation status
export async function GET() {
    try {
        const now = new Date()

        const pendingEscalations = await prisma.complaint.count({
            where: {
                status: {
                    in: ["SUBMITTED", "VIEWED", "IN_PROGRESS"],
                },
                escalationDueAt: {
                    lte: now,
                },
            },
        })

        const upcomingEscalations = await prisma.complaint.count({
            where: {
                status: {
                    in: ["SUBMITTED", "VIEWED", "IN_PROGRESS"],
                },
                escalationDueAt: {
                    gt: now,
                    lte: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Next 24 hours
                },
            },
        })

        return NextResponse.json({
            pendingEscalations,
            upcomingEscalations,
        })
    } catch (error) {
        console.error("Error checking escalation status:", error)
        return NextResponse.json(
            { error: "Failed to check escalation status" },
            { status: 500 }
        )
    }
}
