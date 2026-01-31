import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Get all authorities with their ratings and stats for leaderboard
export async function GET() {
    try {
        const authorities = await prisma.authority.findMany({
            where: { isActive: true },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                satisfactionRatings: {
                    select: {
                        rating: true
                    }
                }
            },
            orderBy: { performanceScore: "desc" }
        })

        const formattedAuthorities = authorities.map(auth => {
            const ratings = auth.satisfactionRatings
            const avgRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : 0

            return {
                id: auth.id,
                name: auth.user.name,
                email: auth.user.email,
                designation: auth.designation,
                department: auth.department.name,
                departmentId: auth.department.id,
                level: auth.level,
                isActive: auth.isActive,
                totalComplaints: auth.totalComplaints,
                resolvedComplaints: auth.resolvedComplaints,
                pendingComplaints: auth.pendingComplaints,
                performanceScore: auth.performanceScore || 0,
                averageRating: Math.round(avgRating * 10) / 10,
                totalRatings: ratings.length
            }
        })

        return NextResponse.json(formattedAuthorities)

    } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }
}
