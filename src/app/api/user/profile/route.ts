import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                emailVerified: true,
                authority: {
                    select: {
                        id: true,
                        designation: true,
                        level: true,
                        department: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        ward: {
                            select: {
                                number: true,
                                name: true,
                                city: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // If authority, get their rating stats
        let authorityWithRating = user.authority
        if (user.authority) {
            const ratings = await prisma.satisfactionRating.findMany({
                where: {
                    complaint: {
                        assignedAuthorityId: user.authority.id
                    }
                },
                select: { rating: true }
            })

            if (ratings.length > 0) {
                const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                authorityWithRating = {
                    ...user.authority,
                    avgRating: Math.round(avgRating * 10) / 10,
                    totalRatings: ratings.length
                } as typeof user.authority & { avgRating: number; totalRatings: number }
            }
        }

        return NextResponse.json({
            ...user,
            authority: authorityWithRating
        })
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        )
    }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, phone } = body

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name && { name }),
                ...(phone && { phone })
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                emailVerified: true,
                authority: {
                    select: {
                        id: true,
                        designation: true,
                        level: true,
                        department: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        ward: {
                            select: {
                                number: true,
                                name: true,
                                city: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        )
    }
}
