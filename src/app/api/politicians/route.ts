import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET all politicians with performance metrics
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const partyId = searchParams.get("partyId")
        const seatType = searchParams.get("seatType") as 'MLA' | 'MP' | null
        const stateId = searchParams.get("stateId")
        const onlyServing = searchParams.get("serving") !== 'false'

        const politicians = await prisma.politician.findMany({
            where: {
                ...(partyId && { partyId }),
                ...(seatType && { seatType }),
                ...(onlyServing && { isCurrentlyServing: true }),
                OR: stateId ? [
                    { assemblyConstituency: { stateId } },
                    { parliamentaryConstituency: { stateId } }
                ] : undefined
            },
            include: {
                party: true,
                assemblyConstituency: {
                    include: {
                        state: true,
                        _count: { select: { complaints: true } }
                    }
                },
                parliamentaryConstituency: {
                    include: {
                        state: true,
                        _count: { select: { complaints: true } }
                    }
                }
            },
            orderBy: { name: 'asc' }
        })

        // Calculate metrics for each politician's constituency
        const politiciansWithMetrics = await Promise.all(
            politicians.map(async (pol) => {
                const constituencyId = pol.seatType === 'MLA'
                    ? pol.assemblyConstituencyId
                    : pol.parliamentaryConstituencyId

                if (!constituencyId) {
                    return {
                        ...pol,
                        metrics: null
                    }
                }

                const whereClause = pol.seatType === 'MLA'
                    ? { assemblyConstituencyId: constituencyId }
                    : { parliamentaryConstituencyId: constituencyId }

                const complaints = await prisma.complaint.findMany({
                    where: whereClause,
                    select: {
                        status: true,
                        createdAt: true,
                        resolvedAt: true,
                        escalationDueAt: true,
                        currentEscalationLevel: true
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

                return {
                    ...pol,
                    metrics: {
                        totalComplaints,
                        resolvedComplaints,
                        resolutionRate: Math.round(resolutionRate),
                        onTimeResolutionRate: Math.round(onTimeRate),
                        escalationRate: totalComplaints > 0 ? Math.round((escalatedComplaints / totalComplaints) * 100) : 0,
                        avgResponseTimeDays: avgResponseTime,
                        performanceScore
                    }
                }
            })
        )

        return NextResponse.json({
            politicians: politiciansWithMetrics,
            total: politiciansWithMetrics.length,
            mlaCount: politiciansWithMetrics.filter(p => p.seatType === 'MLA').length,
            mpCount: politiciansWithMetrics.filter(p => p.seatType === 'MP').length
        })
    } catch (error) {
        console.error("Error fetching politicians:", error)
        return NextResponse.json(
            { error: "Failed to fetch politicians" },
            { status: 500 }
        )
    }
}
