import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET all constituencies with performance metrics
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") // 'assembly' or 'parliamentary'
        const stateId = searchParams.get("stateId")

        // Build query for assembly constituencies
        const assemblyConstituencies = type !== 'parliamentary' ? await prisma.assemblyConstituency.findMany({
            where: stateId ? { stateId } : undefined,
            include: {
                state: {
                    select: { id: true, name: true, code: true }
                },
                politicians: {
                    where: { isCurrentlyServing: true },
                    include: {
                        party: {
                            select: { id: true, name: true, shortName: true, color: true }
                        }
                    }
                },
                _count: {
                    select: { complaints: true, wards: true }
                }
            },
            orderBy: { name: 'asc' }
        }) : []

        // Build query for parliamentary constituencies
        const parliamentaryConstituencies = type !== 'assembly' ? await prisma.parliamentaryConstituency.findMany({
            where: stateId ? { stateId } : undefined,
            include: {
                state: {
                    select: { id: true, name: true, code: true }
                },
                politicians: {
                    where: { isCurrentlyServing: true },
                    include: {
                        party: {
                            select: { id: true, name: true, shortName: true, color: true }
                        }
                    }
                },
                _count: {
                    select: { complaints: true, wards: true }
                }
            },
            orderBy: { name: 'asc' }
        }) : []

        // Calculate performance metrics for each constituency
        const calculateMetrics = async (constituencyId: string, isParliamentary: boolean) => {
            const whereClause = isParliamentary
                ? { parliamentaryConstituencyId: constituencyId }
                : { assemblyConstituencyId: constituencyId }

            const complaints = await prisma.complaint.findMany({
                where: whereClause,
                select: {
                    id: true,
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

            const onTimeResolutions = complaints.filter(c => {
                if (c.status !== 'RESOLVED' && c.status !== 'CLOSED') return false
                if (!c.resolvedAt || !c.escalationDueAt) return false
                return new Date(c.resolvedAt) <= new Date(c.escalationDueAt)
            }).length

            const escalatedComplaints = complaints.filter(c =>
                c.currentEscalationLevel > 1 || c.status === 'ESCALATED'
            ).length

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
            const departmentStats: Record<string, { total: number, resolved: number, name: string }> = {}
            complaints.forEach(c => {
                if (!departmentStats[c.departmentId]) {
                    departmentStats[c.departmentId] = { total: 0, resolved: 0, name: c.department.name }
                }
                departmentStats[c.departmentId].total++
                if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
                    departmentStats[c.departmentId].resolved++
                }
            })

            const departmentBreakdown = Object.entries(departmentStats).map(([id, stats]) => ({
                departmentId: id,
                departmentName: stats.name,
                totalComplaints: stats.total,
                resolvedComplaints: stats.resolved,
                resolutionRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
            })).sort((a, b) => b.totalComplaints - a.totalComplaints)

            return {
                totalComplaints,
                resolvedComplaints,
                resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0,
                onTimeResolutionRate: resolvedComplaints > 0 ? Math.round((onTimeResolutions / resolvedComplaints) * 100) : 0,
                escalationRate: totalComplaints > 0 ? Math.round((escalatedComplaints / totalComplaints) * 100) : 0,
                avgResponseTimeDays: avgResponseTime,
                departmentBreakdown: departmentBreakdown.slice(0, 5)
            }
        }

        // Add metrics to constituencies
        const assemblyWithMetrics = await Promise.all(
            assemblyConstituencies.map(async (ac) => ({
                ...ac,
                type: 'assembly' as const,
                metrics: await calculateMetrics(ac.id, false)
            }))
        )

        const parliamentaryWithMetrics = await Promise.all(
            parliamentaryConstituencies.map(async (pc) => ({
                ...pc,
                type: 'parliamentary' as const,
                metrics: await calculateMetrics(pc.id, true)
            }))
        )

        return NextResponse.json({
            assemblyConstituencies: assemblyWithMetrics,
            parliamentaryConstituencies: parliamentaryWithMetrics,
            totals: {
                assembly: assemblyWithMetrics.length,
                parliamentary: parliamentaryWithMetrics.length
            }
        })
    } catch (error) {
        console.error("Error fetching constituencies:", error)
        return NextResponse.json(
            { error: "Failed to fetch constituencies" },
            { status: 500 }
        )
    }
}
