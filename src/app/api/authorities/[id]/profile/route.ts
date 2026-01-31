import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Get public authority profile with stats and resolved complaints
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const authority = await prisma.authority.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        createdAt: true
                    }
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        color: true
                    }
                },
                ward: {
                    select: {
                        id: true,
                        number: true,
                        name: true,
                        city: {
                            select: {
                                name: true,
                                district: {
                                    select: {
                                        name: true,
                                        state: { select: { name: true } }
                                    }
                                }
                            }
                        }
                    }
                },
                satisfactionRatings: {
                    select: {
                        rating: true,
                        createdAt: true
                    }
                }
            }
        })

        if (!authority) {
            return NextResponse.json({ error: "Authority not found" }, { status: 404 })
        }

        // Get resolved complaints (public view - limited info)
        const resolvedComplaints = await prisma.complaint.findMany({
            where: {
                assignedAuthorityId: id,
                status: { in: ["RESOLVED", "CLOSED"] }
            },
            select: {
                id: true,
                ticketNumber: true,
                title: true,
                status: true,
                priority: true,
                createdAt: true,
                resolvedAt: true,
                department: { select: { name: true } },
                city: { select: { name: true } },
                satisfactionRating: {
                    select: {
                        rating: true,
                        feedback: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { resolvedAt: "desc" },
            take: 20
        })

        // Calculate stats
        const ratings = authority.satisfactionRatings
        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0

        const ratingDistribution = {
            5: ratings.filter(r => r.rating === 5).length,
            4: ratings.filter(r => r.rating === 4).length,
            3: ratings.filter(r => r.rating === 3).length,
            2: ratings.filter(r => r.rating === 2).length,
            1: ratings.filter(r => r.rating === 1).length
        }

        // Calculate average resolution time
        const complaintsWithTime = resolvedComplaints.filter(c => c.resolvedAt && c.createdAt)
        const avgResolutionDays = complaintsWithTime.length > 0
            ? complaintsWithTime.reduce((sum, c) => {
                const days = (new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                return sum + days
            }, 0) / complaintsWithTime.length
            : 0

        // Build jurisdiction string
        let jurisdiction = ""
        if (authority.ward) {
            jurisdiction = `Ward ${authority.ward.number}${authority.ward.name ? ` - ${authority.ward.name}` : ""}, ${authority.ward.city.name}, ${authority.ward.city.district.name}, ${authority.ward.city.district.state.name}`
        }

        return NextResponse.json({
            profile: {
                id: authority.id,
                name: authority.user.name,
                email: authority.user.email,
                designation: authority.designation,
                level: authority.level,
                department: authority.department,
                jurisdiction,
                joinedAt: authority.user.createdAt,
                isActive: authority.isActive
            },
            stats: {
                totalComplaints: authority.totalComplaints,
                resolvedComplaints: authority.resolvedComplaints,
                pendingComplaints: authority.pendingComplaints,
                resolutionRate: authority.totalComplaints > 0
                    ? Math.round((authority.resolvedComplaints / authority.totalComplaints) * 100)
                    : 0,
                performanceScore: Math.round((authority.performanceScore || 0) * 10) / 10,
                averageRating: Math.round(avgRating * 10) / 10,
                totalRatings: ratings.length,
                avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
                ratingDistribution
            },
            recentWork: resolvedComplaints
        })

    } catch (error) {
        console.error("Failed to fetch authority profile:", error)
        return NextResponse.json({ error: "Failed to fetch authority profile" }, { status: 500 })
    }
}
