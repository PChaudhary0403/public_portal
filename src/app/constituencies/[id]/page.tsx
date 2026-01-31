"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    MapPin,
    Users,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Clock,
    Building2,
    Vote,
    Loader2,
    ChevronRight,
    Calendar,
    BarChart3,
    ArrowUpRight
} from "lucide-react"

interface ConstituencyDetails {
    constituency: {
        id: string
        name: string
        constituencyNumber?: number
        reservationStatus: string
        totalVoters?: number
        area?: string
        description?: string
        type: string
        state: { id: string; name: string; code: string }
        politicians: Array<{
            id: string
            name: string
            photoUrl?: string
            seatType: string
            termStartDate: string
            isCurrentlyServing: boolean
            party: { id: string; name: string; shortName: string; color: string | null }
        }>
        wards: Array<{
            id: string
            number: number
            name?: string
            city: { name: string; district: { name: string } }
        }>
    }
    metrics: {
        totalComplaints: number
        resolvedComplaints: number
        pendingComplaints: number
        escalatedComplaints: number
        resolutionRate: number
        onTimeResolutionRate: number
        escalationRate: number
        avgResponseTimeDays: number
        performanceScore: number
        performanceLevel: 'excellent' | 'good' | 'average' | 'poor'
        bestPerformingDept?: { departmentName: string; resolutionRate: number }
        worstPerformingDept?: { departmentName: string; resolutionRate: number }
    }
    departmentBreakdown: Array<{
        departmentId: string
        departmentName: string
        departmentIcon?: string
        departmentColor?: string
        totalComplaints: number
        resolvedComplaints: number
        pendingComplaints: number
        resolutionRate: number
    }>
    monthlyTrend: Array<{
        month: string
        filed: number
        resolved: number
    }>
    recentComplaints: Array<{
        id: string
        ticketNumber: string
        title: string
        status: string
        priority: string
        department: string
        createdAt: string
        resolvedAt?: string
    }>
}

export default function ConstituencyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const searchParams = useSearchParams()
    const type = searchParams.get('type') || 'assembly'

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<ConstituencyDetails | null>(null)

    useEffect(() => {
        fetchConstituencyDetails()
    }, [id, type])

    const fetchConstituencyDetails = async () => {
        try {
            const res = await fetch(`/api/constituencies/${id}?type=${type}`)
            if (res.ok) {
                const result = await res.json()
                setData(result)
            }
        } catch (error) {
            console.error('Failed to fetch constituency details:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPerformanceColor = (level: string) => {
        switch (level) {
            case 'excellent': return 'from-emerald-500 to-green-600'
            case 'good': return 'from-blue-500 to-indigo-600'
            case 'average': return 'from-amber-500 to-orange-600'
            case 'poor': return 'from-red-500 to-rose-600'
            default: return 'from-slate-500 to-gray-600'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVED':
            case 'CLOSED': return 'bg-emerald-100 text-emerald-700'
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700'
            case 'ESCALATED': return 'bg-red-100 text-red-700'
            case 'SUBMITTED':
            case 'VIEWED': return 'bg-amber-100 text-amber-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </main>
                <Footer />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Constituency not found</h2>
                        <Link href="/constituencies">
                            <Button>Back to Constituencies</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { constituency, metrics, departmentBreakdown, monthlyTrend, recentComplaints } = data
    const currentPolitician = constituency.politicians.find(p => p.isCurrentlyServing)

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Link href="/" className="hover:text-indigo-600">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/constituencies" className="hover:text-indigo-600">Constituencies</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-slate-900">{constituency.name}</span>
                    </div>

                    {/* Header Card */}
                    <Card className={`bg-gradient-to-r ${getPerformanceColor(metrics.performanceLevel)} text-white mb-8 overflow-hidden`}>
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {type === 'assembly' ? (
                                            <Vote className="h-5 w-5 opacity-80" />
                                        ) : (
                                            <Building2 className="h-5 w-5 opacity-80" />
                                        )}
                                        <span className="text-sm opacity-80 uppercase tracking-wide">
                                            {type === 'assembly' ? 'Assembly' : 'Parliamentary'} Constituency
                                        </span>
                                        {constituency.reservationStatus !== 'GENERAL' && (
                                            <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                                                {constituency.reservationStatus}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{constituency.name}</h1>
                                    <p className="text-lg opacity-90 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {constituency.state.name}
                                        {constituency.constituencyNumber && (
                                            <span className="ml-2">• No. {constituency.constituencyNumber}</span>
                                        )}
                                    </p>
                                    {constituency.area && (
                                        <p className="mt-2 text-sm opacity-80">{constituency.area}</p>
                                    )}
                                </div>

                                {/* Performance Score */}
                                <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
                                    <div className="text-5xl font-bold mb-1">{metrics.performanceScore}</div>
                                    <div className="text-sm opacity-80">Governance Score</div>
                                    <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                                        {metrics.performanceLevel} Performance
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Users className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">
                                            {metrics.totalComplaints.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-slate-500">Total Complaints</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{metrics.resolutionRate}%</div>
                                        <div className="text-sm text-slate-500">Resolved</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{metrics.avgResponseTimeDays}</div>
                                        <div className="text-sm text-slate-500">Avg Days</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-400'}`} />
                                        <div className={`text-2xl font-bold ${metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-900'}`}>
                                            {metrics.escalationRate}%
                                        </div>
                                        <div className="text-sm text-slate-500">Escalation Rate</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Department Performance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                                        Department-wise Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {departmentBreakdown.length > 0 ? (
                                        <div className="space-y-4">
                                            {departmentBreakdown.map((dept) => (
                                                <div key={dept.departmentId} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{dept.departmentIcon || '🏛️'}</span>
                                                            <span className="font-medium text-slate-900">{dept.departmentName}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-semibold text-slate-900">{dept.resolutionRate}%</span>
                                                            <span className="text-sm text-slate-500 ml-2">
                                                                ({dept.resolvedComplaints}/{dept.totalComplaints})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${dept.resolutionRate >= 70 ? 'bg-emerald-500' :
                                                                    dept.resolutionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${dept.resolutionRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-center py-4">No department data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Monthly Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                                        Monthly Complaint Trend
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end gap-2 h-40">
                                        {monthlyTrend.map((month, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="w-full flex gap-1 items-end h-28">
                                                    <div
                                                        className="flex-1 bg-indigo-500 rounded-t transition-all"
                                                        style={{
                                                            height: `${Math.max(4, (month.filed / Math.max(...monthlyTrend.map(m => m.filed), 1)) * 100)}%`
                                                        }}
                                                        title={`Filed: ${month.filed}`}
                                                    />
                                                    <div
                                                        className="flex-1 bg-emerald-500 rounded-t transition-all"
                                                        style={{
                                                            height: `${Math.max(4, (month.resolved / Math.max(...monthlyTrend.map(m => m.resolved), 1)) * 100)}%`
                                                        }}
                                                        title={`Resolved: ${month.resolved}`}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500">{month.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-indigo-500 rounded" />
                                            <span className="text-sm text-slate-600">Filed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded" />
                                            <span className="text-sm text-slate-600">Resolved</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Complaints */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Complaints</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentComplaints.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentComplaints.map((complaint) => (
                                                <div key={complaint.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 truncate">{complaint.title}</p>
                                                        <p className="text-sm text-slate-500">{complaint.department}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                                        {complaint.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-center py-4">No recent complaints</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Current Representative */}
                            {currentPolitician && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Current Representative</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Link href={`/politicians/${currentPolitician.id}`}>
                                            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                                                    {currentPolitician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">{currentPolitician.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: currentPolitician.party.color || '#6B7280' }}
                                                        />
                                                        <span className="text-sm text-slate-600">{currentPolitician.party.name}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        <Calendar className="h-3 w-3 inline mr-1" />
                                                        Since {new Date(currentPolitician.termStartDate).getFullYear()}
                                                    </p>
                                                </div>
                                                <ArrowUpRight className="h-5 w-5 text-slate-400" />
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Performance Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Performance Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">On-time Resolution</span>
                                        <span className="font-semibold">{metrics.onTimeResolutionRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Pending Issues</span>
                                        <span className="font-semibold">{metrics.pendingComplaints}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Escalated Cases</span>
                                        <span className={`font-semibold ${metrics.escalatedComplaints > 0 ? 'text-red-600' : ''}`}>
                                            {metrics.escalatedComplaints}
                                        </span>
                                    </div>

                                    {metrics.bestPerformingDept && (
                                        <div className="pt-3 border-t">
                                            <p className="text-xs text-slate-500 mb-2">Best Performing</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-emerald-700">
                                                    {metrics.bestPerformingDept.departmentName}
                                                </span>
                                                <span className="text-sm text-emerald-600">
                                                    {metrics.bestPerformingDept.resolutionRate}%
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {metrics.worstPerformingDept && metrics.worstPerformingDept.departmentName !== metrics.bestPerformingDept?.departmentName && (
                                        <div className="pt-3 border-t">
                                            <p className="text-xs text-slate-500 mb-2">Needs Attention</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-red-700">
                                                    {metrics.worstPerformingDept.departmentName}
                                                </span>
                                                <span className="text-sm text-red-600">
                                                    {metrics.worstPerformingDept.resolutionRate}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Coverage Area */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Coverage Area</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {constituency.totalVoters && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Total Voters</span>
                                                <span className="font-semibold">{constituency.totalVoters.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">Wards Covered</span>
                                            <span className="font-semibold">{constituency.wards.length}</span>
                                        </div>
                                    </div>
                                    {constituency.wards.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-xs text-slate-500 mb-2">Wards</p>
                                            <div className="flex flex-wrap gap-1">
                                                {constituency.wards.slice(0, 10).map(ward => (
                                                    <span key={ward.id} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                                                        Ward {ward.number}
                                                    </span>
                                                ))}
                                                {constituency.wards.length > 10 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                                                        +{constituency.wards.length - 10} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Disclaimer */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> All metrics are derived from actual complaint resolution outcomes.
                                    This is a factual representation of service delivery performance, not a political judgment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
