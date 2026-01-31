"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Building2,
    Vote,
    Loader2,
    ChevronRight,
    Calendar,
    BarChart3,
    MapPin,
    Flag,
    ArrowUpRight
} from "lucide-react"

interface PartyDetails {
    party: {
        id: string
        name: string
        shortName: string
        symbol?: string
        color: string | null
        logoUrl?: string
        foundedYear?: number
        ideology?: string
    }
    seatsHeld: {
        mla: number
        mp: number
        total: number
    }
    overallMetrics: {
        totalComplaints: number
        resolvedComplaints: number
        pendingComplaints: number
        escalatedComplaints: number
        resolutionRate: number
        onTimeResolutionRate: number
        escalationRate: number
        avgResponseTimeDays: number
        performanceScore: number
    }
    departmentBreakdown: Array<{
        departmentSlug: string
        departmentName: string
        departmentIcon?: string
        departmentColor?: string
        totalComplaints: number
        resolvedComplaints: number
        resolutionRate: number
    }>
    stateBreakdown: Array<{
        stateId: string
        stateName: string
        seatsHeld: number
        totalComplaints: number
        resolvedComplaints: number
        resolutionRate: number
    }>
    politicianPerformance: Array<{
        id: string
        name: string
        seatType: 'MLA' | 'MP'
        constituency?: string
        state?: string
        totalComplaints: number
        resolvedComplaints: number
        resolutionRate: number
    }>
    monthlyTrend: Array<{
        month: string
        filed: number
        resolved: number
    }>
}

export default function PartyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<PartyDetails | null>(null)

    useEffect(() => {
        fetchPartyDetails()
    }, [id])

    const fetchPartyDetails = async () => {
        try {
            const res = await fetch(`/api/parties/${id}`)
            if (res.ok) {
                const result = await res.json()
                setData(result)
            }
        } catch (error) {
            console.error('Failed to fetch party details:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPerformanceColor = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-green-600'
        if (score >= 60) return 'from-blue-500 to-indigo-600'
        if (score >= 40) return 'from-amber-500 to-orange-600'
        return 'from-red-500 to-rose-600'
    }

    const getPerformanceLevel = (score: number) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Average'
        return 'Needs Improvement'
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
                        <Flag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Party not found</h2>
                        <Link href="/parties">
                            <Button>Back to Parties</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { party, seatsHeld, overallMetrics, departmentBreakdown, stateBreakdown, politicianPerformance, monthlyTrend } = data

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Link href="/" className="hover:text-indigo-600">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/parties" className="hover:text-indigo-600">Parties</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-slate-900">{party.name}</span>
                    </div>

                    {/* Party Header */}
                    <Card className="mb-8 overflow-hidden">
                        <div
                            className="h-3"
                            style={{ backgroundColor: party.color || '#6B7280' }}
                        />
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Party Info */}
                                <div className="flex items-start gap-6 flex-1">
                                    <div
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                                        style={{ backgroundColor: party.color || '#6B7280' }}
                                    >
                                        {party.shortName.slice(0, 3)}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                                            {party.name}
                                        </h1>
                                        <p className="text-lg text-slate-600">{party.shortName}</p>
                                        {party.symbol && (
                                            <p className="text-sm text-slate-500 mt-1">
                                                <strong>Symbol:</strong> {party.symbol}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                                            {party.foundedYear && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Founded {party.foundedYear}
                                                </span>
                                            )}
                                        </div>
                                        {party.ideology && (
                                            <p className="mt-3 text-sm text-slate-600">{party.ideology}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Seats & Performance */}
                                <div className="flex flex-col gap-4">
                                    {/* Seats */}
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                        <div className="text-center px-4">
                                            <div className="text-2xl font-bold text-indigo-600">{seatsHeld.mla}</div>
                                            <div className="text-xs text-slate-500">MLAs</div>
                                        </div>
                                        <div className="w-px h-10 bg-slate-200" />
                                        <div className="text-center px-4">
                                            <div className="text-2xl font-bold text-emerald-600">{seatsHeld.mp}</div>
                                            <div className="text-xs text-slate-500">MPs</div>
                                        </div>
                                        <div className="w-px h-10 bg-slate-200" />
                                        <div className="text-center px-4">
                                            <div className="text-2xl font-bold text-slate-900">{seatsHeld.total}</div>
                                            <div className="text-xs text-slate-500">Total</div>
                                        </div>
                                    </div>

                                    {/* Performance Score */}
                                    <div className={`p-4 rounded-xl bg-gradient-to-br ${getPerformanceColor(overallMetrics.performanceScore)} text-white text-center`}>
                                        <div className="text-4xl font-bold mb-1">{overallMetrics.performanceScore}</div>
                                        <div className="text-sm opacity-80">Governance Score</div>
                                        <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-sm inline-block">
                                            {getPerformanceLevel(overallMetrics.performanceScore)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Users className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">
                                            {overallMetrics.totalComplaints.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-slate-500">Total Complaints</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{overallMetrics.resolutionRate}%</div>
                                        <div className="text-sm text-slate-500">Resolved</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{overallMetrics.avgResponseTimeDays}</div>
                                        <div className="text-sm text-slate-500">Avg Days</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${overallMetrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-400'}`} />
                                        <div className={`text-2xl font-bold ${overallMetrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-900'}`}>
                                            {overallMetrics.escalationRate}%
                                        </div>
                                        <div className="text-sm text-slate-500">Escalation</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Representative Performance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                        Representative Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {politicianPerformance.length > 0 ? (
                                        <div className="space-y-3">
                                            {politicianPerformance.slice(0, 10).map((pol, index) => (
                                                <Link key={pol.id} href={`/politicians/${pol.id}`}>
                                                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                                        <span className="text-sm font-medium text-slate-400 w-6">
                                                            {index + 1}.
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-slate-900 truncate">{pol.name}</p>
                                                            <p className="text-sm text-slate-500">
                                                                {pol.seatType} • {pol.constituency}, {pol.state}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-lg font-bold ${pol.resolutionRate >= 70 ? 'text-emerald-600' :
                                                                    pol.resolutionRate >= 50 ? 'text-amber-600' : 'text-red-600'
                                                                }`}>
                                                                {pol.resolutionRate}%
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {pol.totalComplaints} complaints
                                                            </div>
                                                        </div>
                                                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-center py-4">No representatives data available</p>
                                    )}
                                </CardContent>
                            </Card>

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
                                                <div key={dept.departmentSlug} className="space-y-2">
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
                                                        className="flex-1 rounded-t transition-all"
                                                        style={{
                                                            height: `${Math.max(4, (month.filed / Math.max(...monthlyTrend.map(m => m.filed), 1)) * 100)}%`,
                                                            backgroundColor: party.color || '#6366f1'
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
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: party.color || '#6366f1' }} />
                                            <span className="text-sm text-slate-600">Filed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded" />
                                            <span className="text-sm text-slate-600">Resolved</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Overall Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Governance Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">On-time Resolution</span>
                                        <span className="font-semibold">{overallMetrics.onTimeResolutionRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Pending Issues</span>
                                        <span className="font-semibold">{overallMetrics.pendingComplaints}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Escalated Cases</span>
                                        <span className={`font-semibold ${overallMetrics.escalatedComplaints > 0 ? 'text-red-600' : ''}`}>
                                            {overallMetrics.escalatedComplaints}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* State-wise Breakdown */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-indigo-600" />
                                        State-wise Presence
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {stateBreakdown.length > 0 ? (
                                        <div className="space-y-3">
                                            {stateBreakdown.map((state) => (
                                                <div key={state.stateId} className="p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-slate-900">{state.stateName}</span>
                                                        <span className="text-sm text-slate-500">{state.seatsHeld} seats</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-500">{state.totalComplaints} complaints</span>
                                                        <span className={`font-medium ${state.resolutionRate >= 70 ? 'text-emerald-600' :
                                                                state.resolutionRate >= 50 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>
                                                            {state.resolutionRate}% resolved
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-center py-4">No state data available</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Quick Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href="/constituencies">
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <Vote className="h-4 w-4" />
                                            View All Constituencies
                                        </Button>
                                    </Link>
                                    <Link href="/politicians">
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <Users className="h-4 w-4" />
                                            View All Representatives
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Disclaimer */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> Party performance is aggregated from complaint resolution
                                    data across all constituencies held by party representatives. This is a factual
                                    representation of service delivery, not a political assessment.
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
