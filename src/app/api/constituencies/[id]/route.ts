import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// Define the complaint type with included relations
type ComplaintWithRelations = {
    id: string
    ticketNumber: string
    title: string
    description: string
    status: 'SUBMITTED' | 'VIEWED' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED' | 'CLOSED' | 'REJECTED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    createdAt: Date
    resolvedAt: Date | null
    escalationDueAt: Date | null
    currentEscalationLevel: number
    departmentId: string
    department: {
        id: string
        name: string
        icon: string | null
        color: string | null
    }
    city: {
        id: string
        name: string
    }
    ward: {
        id: string
        number: number
    } | null
}

// GET single constituency with detailed metrics
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || 'assembly'

        let constituency
        let complaints: ComplaintWithRelations[] = []

        if (type === 'parliamentary') {
            constituency = await prisma.parliamentaryConstituency.findUnique({
                where: { id },
                include: {
                    state: true,
                    politicians: {
                        include: {
                            party: true
                        },
                        orderBy: { termStartDate: 'desc' }
                    },
                    wards: {
                        include: {
                            city: {
                                include: {
                                    district: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: { complaints: true, wards: true }
                    }
                }
            })

            if (constituency) {
                const rawComplaints = await prisma.complaint.findMany({
                    where: { parliamentaryConstituencyId: id },
                    include: {
                        department: true,
                        city: true,
                        ward: true
                    },
                    orderBy: { createdAt: 'desc' }
                })
                complaints = rawComplaints as unknown as ComplaintWithRelations[]
            }
        } else {
            constituency = await prisma.assemblyConstituency.findUnique({
                where: { id },
                include: {
                    state: true,
                    politicians: {
                        include: {
                            party: true
                        },
                        orderBy: { termStartDate: 'desc' }
                    },
                    wards: {
                        include: {
                            city: {
                                include: {
                                    district: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: { complaints: true, wards: true }
                    }
                }
            })

            if (constituency) {
                const rawComplaints = await prisma.complaint.findMany({
                    where: { assemblyConstituencyId: id },
                    include: {
                        department: true,
                        city: true,
                        ward: true
                    },
                    orderBy: { createdAt: 'desc' }
                })
                complaints = rawComplaints as unknown as ComplaintWithRelations[]
            }
        }

        if (!constituency) {
            return NextResponse.json(
                { error: "Constituency not found" },
                { status: 404 }
            )
        }

        // Calculate detailed metrics
        const totalComplaints = complaints?.length || 0
        const resolvedComplaints = complaints?.filter(c =>
            c.status === 'RESOLVED' || c.status === 'CLOSED'
        ).length || 0

        const pendingComplaints = complaints?.filter(c =>
            c.status === 'SUBMITTED' || c.status === 'VIEWED' || c.status === 'IN_PROGRESS'
        ).length || 0

        const escalatedComplaints = complaints?.filter(c =>
            c.currentEscalationLevel > 1 || c.status === 'ESCALATED'
        ).length || 0

        const onTimeResolutions = complaints?.filter(c => {
            if (c.status !== 'RESOLVED' && c.status !== 'CLOSED') return false
            if (!c.resolvedAt || !c.escalationDueAt) return false
            return new Date(c.resolvedAt) <= new Date(c.escalationDueAt)
        }).length || 0

        // Average response time
        let avgResponseTime = 0
        const resolvedWithTime = complaints?.filter(c => c.resolvedAt) || []
        if (resolvedWithTime.length > 0) {
            const totalTime = resolvedWithTime.reduce((acc, c) => {
                const days = (new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                return acc + days
            }, 0)
            avgResponseTime = Math.round(totalTime / resolvedWithTime.length * 10) / 10
        }

        // Department breakdown
        const departmentStats: Record<string, { total: number, resolved: number, pending: number, name: string, icon: string | null, color: string | null }> = {}
        complaints?.forEach(c => {
            if (!departmentStats[c.departmentId]) {
                departmentStats[c.departmentId] = {
                    total: 0,
                    resolved: 0,
                    pending: 0,
                    name: c.department.name,
                    icon: c.department.icon,
                    color: c.department.color
                }
            }
            departmentStats[c.departmentId].total++
            if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
                departmentStats[c.departmentId].resolved++
            } else {
                departmentStats[c.departmentId].pending++
            }
        })

        const departmentBreakdown = Object.entries(departmentStats).map(([id, stats]) => ({
            departmentId: id,
            departmentName: stats.name,
            departmentIcon: stats.icon,
            departmentColor: stats.color,
            totalComplaints: stats.total,
            resolvedComplaints: stats.resolved,
            pendingComplaints: stats.pending,
            resolutionRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
        })).sort((a, b) => b.totalComplaints - a.totalComplaints)

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyTrend: { month: string, filed: number, resolved: number }[] = []
        for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            const filedInMonth = complaints?.filter(c => {
                const created = new Date(c.createdAt)
                return created >= monthStart && created <= monthEnd
            }).length || 0

            const resolvedInMonth = complaints?.filter(c => {
                if (!c.resolvedAt) return false
                const resolved = new Date(c.resolvedAt)
                return resolved >= monthStart && resolved <= monthEnd
            }).length || 0

            monthlyTrend.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                filed: filedInMonth,
                resolved: resolvedInMonth
            })
        }

        // Performance score (0-100)
        const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 100
        const onTimeRate = resolvedComplaints > 0 ? (onTimeResolutions / resolvedComplaints) * 100 : 100
        const nonEscalationRate = totalComplaints > 0 ? ((totalComplaints - escalatedComplaints) / totalComplaints) * 100 : 100
        const performanceScore = Math.round(
            (resolutionRate * 0.4) +
            (onTimeRate * 0.35) +
            (nonEscalationRate * 0.25)
        )

        // Determine performance level
        let performanceLevel: 'excellent' | 'good' | 'average' | 'poor'
        if (performanceScore >= 80) performanceLevel = 'excellent'
        else if (performanceScore >= 60) performanceLevel = 'good'
        else if (performanceScore >= 40) performanceLevel = 'average'
        else performanceLevel = 'poor'

        // Best and worst performing departments
        const sortedDepts = [...departmentBreakdown]
        const bestPerforming = sortedDepts.sort((a, b) => b.resolutionRate - a.resolutionRate)[0]
        const worstPerforming = sortedDepts.sort((a, b) => a.resolutionRate - b.resolutionRate)[0]

        return NextResponse.json({
            constituency: {
                ...constituency,
                type
            },
            metrics: {
                totalComplaints,
                resolvedComplaints,
                pendingComplaints,
                escalatedComplaints,
                resolutionRate: Math.round(resolutionRate),
                onTimeResolutionRate: Math.round(onTimeRate),
                escalationRate: totalComplaints > 0 ? Math.round((escalatedComplaints / totalComplaints) * 100) : 0,
                avgResponseTimeDays: avgResponseTime,
                performanceScore,
                performanceLevel,
                bestPerformingDept: bestPerforming,
                worstPerformingDept: worstPerforming
            },
            departmentBreakdown,
            monthlyTrend,
            recentComplaints: complaints?.slice(0, 10).map(c => ({
                id: c.id,
                ticketNumber: c.ticketNumber,
                title: c.title,
                status: c.status,
                priority: c.priority,
                department: c.department.name,
                createdAt: c.createdAt,
                resolvedAt: c.resolvedAt
            })) || []
        })
    } catch (error) {
        console.error("Error fetching constituency:", error)
        return NextResponse.json(
            { error: "Failed to fetch constituency details" },
            { status: 500 }
        )
    }
}
