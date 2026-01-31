import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET single politician with detailed constituency metrics
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const politician = await prisma.politician.findUnique({
            where: { id },
            include: {
                party: true,
                assemblyConstituency: {
                    include: {
                        state: true,
                        wards: {
                            include: {
                                city: true
                            }
                        }
                    }
                },
                parliamentaryConstituency: {
                    include: {
                        state: true,
                        wards: {
                            include: {
                                city: true
                            }
                        }
                    }
                }
            }
        })

        if (!politician) {
            return NextResponse.json(
                { error: "Politician not found" },
                { status: 404 }
            )
        }

        // Get complaints for the constituency
        const constituencyId = politician.seatType === 'MLA'
            ? politician.assemblyConstituencyId
            : politician.parliamentaryConstituencyId

        let complaints: Array<{
            id: string
            ticketNumber: string
            title: string
            status: string
            priority: string
            createdAt: Date
            resolvedAt: Date | null
            escalationDueAt: Date | null
            currentEscalationLevel: number
            department: { name: string; slug: string; icon: string | null; color: string | null }
        }> = []

        if (constituencyId) {
            const whereClause = politician.seatType === 'MLA'
                ? { assemblyConstituencyId: constituencyId }
                : { parliamentaryConstituencyId: constituencyId }

            complaints = await prisma.complaint.findMany({
                where: whereClause,
                select: {
                    id: true,
                    ticketNumber: true,
                    title: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    resolvedAt: true,
                    escalationDueAt: true,
                    currentEscalationLevel: true,
                    department: {
                        select: { name: true, slug: true, icon: true, color: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        }

        // Calculate metrics
        const totalComplaints = complaints.length
        const resolvedComplaints = complaints.filter(c =>
            c.status === 'RESOLVED' || c.status === 'CLOSED'
        ).length

        const pendingComplaints = complaints.filter(c =>
            c.status === 'SUBMITTED' || c.status === 'VIEWED' || c.status === 'IN_PROGRESS'
        ).length

        const escalatedComplaints = complaints.filter(c =>
            c.currentEscalationLevel > 1 || c.status === 'ESCALATED'
        ).length

        const onTimeResolutions = complaints.filter(c => {
            if (c.status !== 'RESOLVED' && c.status !== 'CLOSED') return false
            if (!c.resolvedAt || !c.escalationDueAt) return false
            return new Date(c.resolvedAt) <= new Date(c.escalationDueAt)
        }).length

        let avgResponseTime = 0
        const resolvedWithTime = complaints.filter(c => c.resolvedAt)
        if (resolvedWithTime.length > 0) {
            const totalTime = resolvedWithTime.reduce((acc, c) => {
                const days = (new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                return acc + days
            }, 0)
            avgResponseTime = Math.round(totalTime / resolvedWithTime.length * 10) / 10
        }

        // Department breakdown
        const departmentStats: Record<string, { total: number, resolved: number, name: string, icon: string | null, color: string | null }> = {}
        complaints.forEach(c => {
            const key = c.department.slug
            if (!departmentStats[key]) {
                departmentStats[key] = {
                    total: 0,
                    resolved: 0,
                    name: c.department.name,
                    icon: c.department.icon,
                    color: c.department.color
                }
            }
            departmentStats[key].total++
            if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
                departmentStats[key].resolved++
            }
        })

        const departmentBreakdown = Object.entries(departmentStats).map(([slug, stats]) => ({
            departmentSlug: slug,
            departmentName: stats.name,
            departmentIcon: stats.icon,
            departmentColor: stats.color,
            totalComplaints: stats.total,
            resolvedComplaints: stats.resolved,
            resolutionRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
        })).sort((a, b) => b.totalComplaints - a.totalComplaints)

        // Calculate performance score
        const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 100
        const onTimeRate = resolvedComplaints > 0 ? (onTimeResolutions / resolvedComplaints) * 100 : 100
        const nonEscalationRate = totalComplaints > 0 ? ((totalComplaints - escalatedComplaints) / totalComplaints) * 100 : 100
        const performanceScore = Math.round(
            (resolutionRate * 0.4) +
            (onTimeRate * 0.35) +
            (nonEscalationRate * 0.25)
        )

        let performanceLevel: 'excellent' | 'good' | 'average' | 'poor'
        if (performanceScore >= 80) performanceLevel = 'excellent'
        else if (performanceScore >= 60) performanceLevel = 'good'
        else if (performanceScore >= 40) performanceLevel = 'average'
        else performanceLevel = 'poor'

        // Monthly trend (last 6 months)
        const monthlyTrend: { month: string, filed: number, resolved: number }[] = []
        for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            const filedInMonth = complaints.filter(c => {
                const created = new Date(c.createdAt)
                return created >= monthStart && created <= monthEnd
            }).length

            const resolvedInMonth = complaints.filter(c => {
                if (!c.resolvedAt) return false
                const resolved = new Date(c.resolvedAt)
                return resolved >= monthStart && resolved <= monthEnd
            }).length

            monthlyTrend.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                filed: filedInMonth,
                resolved: resolvedInMonth
            })
        }

        // Calculate term duration
        const termDuration = politician.termEndDate
            ? Math.round((new Date(politician.termEndDate).getTime() - new Date(politician.termStartDate).getTime()) / (1000 * 60 * 60 * 24 * 365) * 10) / 10
            : Math.round((new Date().getTime() - new Date(politician.termStartDate).getTime()) / (1000 * 60 * 60 * 24 * 365) * 10) / 10

        return NextResponse.json({
            politician,
            governanceStats: {
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
                termDurationYears: termDuration
            },
            departmentBreakdown,
            monthlyTrend,
            recentComplaints: complaints.slice(0, 10)
        })
    } catch (error) {
        console.error("Error fetching politician:", error)
        return NextResponse.json(
            { error: "Failed to fetch politician details" },
            { status: 500 }
        )
    }
}
