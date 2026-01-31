import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET all parties with aggregated performance metrics
export async function GET() {
    try {
        const parties = await prisma.politicalParty.findMany({
            where: { isActive: true },
            include: {
                politicians: {
                    where: { isCurrentlyServing: true },
                    include: {
                        assemblyConstituency: true,
                        parliamentaryConstituency: true
                    }
                },
                _count: {
                    select: { politicians: true }
                }
            },
            orderBy: { name: 'asc' }
        })

        // Calculate aggregated metrics for each party
        const partiesWithMetrics = await Promise.all(
            parties.map(async (party) => {
                // Get all constituency IDs for this party
                const assemblyIds = party.politicians
                    .filter(p => p.seatType === 'MLA' && p.assemblyConstituencyId)
                    .map(p => p.assemblyConstituencyId!)

                const parliamentaryIds = party.politicians
                    .filter(p => p.seatType === 'MP' && p.parliamentaryConstituencyId)
                    .map(p => p.parliamentaryConstituencyId!)

                // Get all complaints across all constituencies held by this party
                const complaints = await prisma.complaint.findMany({
                    where: {
                        OR: [
                            { assemblyConstituencyId: { in: assemblyIds } },
                            { parliamentaryConstituencyId: { in: parliamentaryIds } }
                        ]
                    },
                    select: {
                        status: true,
                        createdAt: true,
                        resolvedAt: true,
                        escalationDueAt: true,
                        currentEscalationLevel: true,
                        departmentId: true,
                        department: {
                            select: { name: true, slug: true }
                        }
                    }
                })

                const totalComplaints = complaints.length
                const resolvedComplaints = complaints.filter(c =>
                    c.status === 'RESOLVED' || c.status === 'CLOSED'
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
                const departmentStats: Record<string, { total: number, resolved: number, name: string }> = {}
                complaints.forEach(c => {
                    if (!departmentStats[c.department.slug]) {
                        departmentStats[c.department.slug] = { total: 0, resolved: 0, name: c.department.name }
                    }
                    departmentStats[c.department.slug].total++
                    if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
                        departmentStats[c.department.slug].resolved++
                    }
                })

                const departmentBreakdown = Object.entries(departmentStats).map(([slug, stats]) => ({
                    departmentSlug: slug,
                    departmentName: stats.name,
                    totalComplaints: stats.total,
                    resolvedComplaints: stats.resolved,
                    resolutionRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
                })).sort((a, b) => b.totalComplaints - a.totalComplaints)

                // Find best and worst performing departments
                const sortedDepts = [...departmentBreakdown].filter(d => d.totalComplaints >= 5)
                const bestDept = sortedDepts.sort((a, b) => b.resolutionRate - a.resolutionRate)[0]
                const worstDept = sortedDepts.sort((a, b) => a.resolutionRate - b.resolutionRate)[0]

                return {
                    id: party.id,
                    name: party.name,
                    shortName: party.shortName,
                    symbol: party.symbol,
                    color: party.color,
                    logoUrl: party.logoUrl,
                    foundedYear: party.foundedYear,
                    ideology: party.ideology,
                    seatsHeld: {
                        mla: party.politicians.filter(p => p.seatType === 'MLA').length,
                        mp: party.politicians.filter(p => p.seatType === 'MP').length,
                        total: party.politicians.length
                    },
                    metrics: {
                        totalComplaints,
                        resolvedComplaints,
                        resolutionRate: Math.round(resolutionRate),
                        onTimeResolutionRate: Math.round(onTimeRate),
                        escalationRate: totalComplaints > 0 ? Math.round((escalatedComplaints / totalComplaints) * 100) : 0,
                        avgResponseTimeDays: avgResponseTime,
                        performanceScore,
                        bestPerformingDept: bestDept?.departmentName || 'N/A',
                        worstPerformingDept: worstDept?.departmentName || 'N/A'
                    },
                    topDepartments: departmentBreakdown.slice(0, 3)
                }
            })
        )

        // Sort by performance score
        const sortedParties = partiesWithMetrics.sort((a, b) =>
            b.metrics.performanceScore - a.metrics.performanceScore
        )

        return NextResponse.json({
            parties: sortedParties,
            total: sortedParties.length,
            summary: {
                totalMlaSeats: sortedParties.reduce((acc, p) => acc + p.seatsHeld.mla, 0),
                totalMpSeats: sortedParties.reduce((acc, p) => acc + p.seatsHeld.mp, 0),
                avgResolutionRate: Math.round(
                    sortedParties.reduce((acc, p) => acc + p.metrics.resolutionRate, 0) / sortedParties.length
                )
            }
        })
    } catch (error) {
        console.error("Error fetching parties:", error)
        return NextResponse.json(
            { error: "Failed to fetch parties" },
            { status: 500 }
        )
    }
}
