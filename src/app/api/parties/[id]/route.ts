import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET single party with detailed performance metrics
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const party = await prisma.politicalParty.findUnique({
            where: { id },
            include: {
                politicians: {
                    where: { isCurrentlyServing: true },
                    include: {
                        assemblyConstituency: {
                            include: { state: true }
                        },
                        parliamentaryConstituency: {
                            include: { state: true }
                        }
                    },
                    orderBy: { name: 'asc' }
                }
            }
        })

        if (!party) {
            return NextResponse.json(
                { error: "Party not found" },
                { status: 404 }
            )
        }

        // Get all constituency IDs
        const assemblyIds = party.politicians
            .filter(p => p.seatType === 'MLA' && p.assemblyConstituencyId)
            .map(p => p.assemblyConstituencyId!)

        const parliamentaryIds = party.politicians
            .filter(p => p.seatType === 'MP' && p.parliamentaryConstituencyId)
            .map(p => p.parliamentaryConstituencyId!)

        // Get all complaints
        const complaints = await prisma.complaint.findMany({
            where: {
                OR: [
                    { assemblyConstituencyId: { in: assemblyIds } },
                    { parliamentaryConstituencyId: { in: parliamentaryIds } }
                ]
            },
            include: {
                department: true,
                assemblyConstituency: true,
                parliamentaryConstituency: true
            }
        })

        // Overall metrics
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

        const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 100
        const onTimeRate = resolvedComplaints > 0 ? (onTimeResolutions / resolvedComplaints) * 100 : 100
        const nonEscalationRate = totalComplaints > 0 ? ((totalComplaints - escalatedComplaints) / totalComplaints) * 100 : 100
        const performanceScore = Math.round(
            (resolutionRate * 0.4) +
            (onTimeRate * 0.35) +
            (nonEscalationRate * 0.25)
        )

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

        // State-wise breakdown
        const stateStats: Record<string, { total: number, resolved: number, name: string, seats: number }> = {}

        party.politicians.forEach(pol => {
            const state = pol.assemblyConstituency?.state || pol.parliamentaryConstituency?.state
            if (state) {
                if (!stateStats[state.id]) {
                    stateStats[state.id] = { total: 0, resolved: 0, name: state.name, seats: 0 }
                }
                stateStats[state.id].seats++
            }
        })

        complaints.forEach(c => {
            const state = c.assemblyConstituency?.stateId || c.parliamentaryConstituency?.stateId
            if (state && stateStats[state]) {
                stateStats[state].total++
                if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
                    stateStats[state].resolved++
                }
            }
        })

        const stateBreakdown = Object.entries(stateStats).map(([id, stats]) => ({
            stateId: id,
            stateName: stats.name,
            seatsHeld: stats.seats,
            totalComplaints: stats.total,
            resolvedComplaints: stats.resolved,
            resolutionRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
        })).sort((a, b) => b.seatsHeld - a.seatsHeld)

        // Per-politician performance
        const politicianPerformance = await Promise.all(
            party.politicians.map(async (pol) => {
                const constituencyId = pol.seatType === 'MLA'
                    ? pol.assemblyConstituencyId
                    : pol.parliamentaryConstituencyId

                const polComplaints = complaints.filter(c =>
                    (pol.seatType === 'MLA' && c.assemblyConstituencyId === constituencyId) ||
                    (pol.seatType === 'MP' && c.parliamentaryConstituencyId === constituencyId)
                )

                const polTotal = polComplaints.length
                const polResolved = polComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length
                const polResolutionRate = polTotal > 0 ? Math.round((polResolved / polTotal) * 100) : 0

                return {
                    id: pol.id,
                    name: pol.name,
                    seatType: pol.seatType,
                    constituency: pol.assemblyConstituency?.name || pol.parliamentaryConstituency?.name,
                    state: pol.assemblyConstituency?.state.name || pol.parliamentaryConstituency?.state.name,
                    totalComplaints: polTotal,
                    resolvedComplaints: polResolved,
                    resolutionRate: polResolutionRate
                }
            })
        )

        // Monthly trend
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

        return NextResponse.json({
            party: {
                id: party.id,
                name: party.name,
                shortName: party.shortName,
                symbol: party.symbol,
                color: party.color,
                logoUrl: party.logoUrl,
                foundedYear: party.foundedYear,
                ideology: party.ideology
            },
            seatsHeld: {
                mla: party.politicians.filter(p => p.seatType === 'MLA').length,
                mp: party.politicians.filter(p => p.seatType === 'MP').length,
                total: party.politicians.length
            },
            overallMetrics: {
                totalComplaints,
                resolvedComplaints,
                pendingComplaints,
                escalatedComplaints,
                resolutionRate: Math.round(resolutionRate),
                onTimeResolutionRate: Math.round(onTimeRate),
                escalationRate: totalComplaints > 0 ? Math.round((escalatedComplaints / totalComplaints) * 100) : 0,
                avgResponseTimeDays: avgResponseTime,
                performanceScore
            },
            departmentBreakdown,
            stateBreakdown,
            politicianPerformance: politicianPerformance.sort((a, b) => b.resolutionRate - a.resolutionRate),
            monthlyTrend
        })
    } catch (error) {
        console.error("Error fetching party:", error)
        return NextResponse.json(
            { error: "Failed to fetch party details" },
            { status: 500 }
        )
    }
}
