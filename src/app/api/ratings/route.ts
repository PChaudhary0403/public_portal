import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST - Submit a rating for a resolved complaint
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { complaintId, rating, feedback } = body

        // Validate rating (1-5 stars)
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5 stars" }, { status: 400 })
        }

        // Get the complaint
        const complaint = await prisma.complaint.findUnique({
            where: { id: complaintId },
            include: { satisfactionRating: true }
        })

        if (!complaint) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
        }

        // Check if the user is the citizen who filed the complaint
        if (complaint.citizenId !== session.user.id) {
            return NextResponse.json({ error: "You can only rate your own complaints" }, { status: 403 })
        }

        // Check if the complaint is resolved or closed
        if (complaint.status !== "RESOLVED" && complaint.status !== "CLOSED") {
            return NextResponse.json({ error: "You can only rate resolved or closed complaints" }, { status: 400 })
        }

        // Check if there's an assigned authority
        if (!complaint.assignedAuthorityId) {
            return NextResponse.json({ error: "No authority assigned to this complaint" }, { status: 400 })
        }

        // Check if already rated
        if (complaint.satisfactionRating) {
            return NextResponse.json({ error: "You have already rated this complaint" }, { status: 400 })
        }

        // Create the rating
        const satisfactionRating = await prisma.satisfactionRating.create({
            data: {
                complaintId,
                citizenId: session.user.id,
                authorityId: complaint.assignedAuthorityId,
                rating,
                feedback: feedback || null
            }
        })

        // Update authority's average rating and performance score
        const allRatings = await prisma.satisfactionRating.findMany({
            where: { authorityId: complaint.assignedAuthorityId }
        })

        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length

        // Calculate performance score (weighted: 60% resolution rate, 40% avg rating)
        const authority = await prisma.authority.findUnique({
            where: { id: complaint.assignedAuthorityId }
        })

        if (authority) {
            const resolutionRate = authority.totalComplaints > 0
                ? (authority.resolvedComplaints / authority.totalComplaints) * 100
                : 0
            const performanceScore = (resolutionRate * 0.6) + ((avgRating / 5) * 100 * 0.4)

            await prisma.authority.update({
                where: { id: complaint.assignedAuthorityId },
                data: {
                    performanceScore,
                    resolutionRate
                }
            })
        }

        return NextResponse.json({
            success: true,
            rating: satisfactionRating,
            message: "Thank you for your feedback!"
        })

    } catch (error) {
        console.error("Failed to submit rating:", error)
        return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 })
    }
}

// GET - Get ratings for a specific authority or complaint
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const authorityId = searchParams.get("authorityId")
        const complaintId = searchParams.get("complaintId")

        if (complaintId) {
            const rating = await prisma.satisfactionRating.findUnique({
                where: { complaintId },
                include: {
                    citizen: { select: { name: true } },
                    authority: {
                        select: {
                            designation: true,
                            user: { select: { name: true } }
                        }
                    }
                }
            })
            return NextResponse.json(rating)
        }

        if (authorityId) {
            const ratings = await prisma.satisfactionRating.findMany({
                where: { authorityId },
                include: {
                    citizen: { select: { name: true } },
                    complaint: { select: { ticketNumber: true, title: true } }
                },
                orderBy: { createdAt: "desc" },
                take: 50
            })

            // Calculate stats
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

            return NextResponse.json({
                ratings,
                stats: {
                    totalRatings: ratings.length,
                    averageRating: Math.round(avgRating * 10) / 10,
                    distribution: ratingDistribution
                }
            })
        }

        return NextResponse.json({ error: "authorityId or complaintId required" }, { status: 400 })

    } catch (error) {
        console.error("Failed to fetch ratings:", error)
        return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
    }
}
