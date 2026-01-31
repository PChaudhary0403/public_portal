"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    User,
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
    Award,
    GraduationCap
} from "lucide-react"

interface PoliticianDetails {
    politician: {
        id: string
        name: string
        gender: string
        education?: string
        occupation?: string
        biography?: string
        photoUrl?: string
        seatType: 'MLA' | 'MP'
        termStartDate: string
        termEndDate?: string
        isCurrentlyServing: boolean
        party: {
            id: string
            name: string
            shortName: string
            color: string | null
            symbol?: string
        }
        assemblyConstituency?: {
            id: string
            name: string
            reservationStatus: string
            state: { id: string; name: string; code: string }
            wards: Array<{ id: string; number: number; city: { name: string } }>
        }
        parliamentaryConstituency?: {
            id: string
            name: string
            reservationStatus: string
            state: { id: string; name: string; code: string }
            wards: Array<{ id: string; number: number; city: { name: string } }>
        }
    }
    governanceStats: {
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
        termDurationYears: number
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
        department: { name: string }
        createdAt: string
    }>
}

export default function PoliticianDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<PoliticianDetails | null>(null)

    useEffect(() => {
        fetchPoliticianDetails()
    }, [id])

    const fetchPoliticianDetails = async () => {
        try {
            const res = await fetch(`/api/politicians/${id}`)
            if (res.ok) {
                const result = await res.json()
                setData(result)
            }
        } catch (error) {
            console.error('Failed to fetch politician details:', error)
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
            default: return 'bg-amber-100 text-amber-700'
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
                        <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Representative not found</h2>
                        <Link href="/politicians">
                            <Button>Back to Representatives</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { politician, governanceStats, departmentBreakdown, monthlyTrend, recentComplaints } = data
    const constituency = politician.seatType === 'MLA'
        ? politician.assemblyConstituency
        : politician.parliamentaryConstituency

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Link href="/" className="hover:text-indigo-600">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/politicians" className="hover:text-indigo-600">Representatives</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-slate-900">{politician.name}</span>
                    </div>

                    {/* Profile Header */}
                    <Card className="mb-8 overflow-hidden">
                        <div
                            className="h-3"
                            style={{ backgroundColor: politician.party.color || '#6B7280' }}
                        />
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Avatar and Basic Info */}
                                <div className="flex items-start gap-6">
                                    <div
                                        className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${getPerformanceColor(governanceStats.performanceLevel)} flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg`}
                                    >
                                        {politician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${politician.seatType === 'MLA'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {politician.seatType === 'MLA' ? 'Member of Legislative Assembly' : 'Member of Parliament'}
                                            </span>
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                            {politician.name}
                                        </h1>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: politician.party.color || '#6B7280' }}
                                            />
                                            <Link
                                                href={`/parties/${politician.party.id}`}
                                                className="text-lg text-slate-700 hover:text-indigo-600"
                                            >
                                                {politician.party.name}
                                            </Link>
                                        </div>

                                        {constituency && (
                                            <Link
                                                href={`/constituencies/${constituency.id}?type=${politician.seatType === 'MLA' ? 'assembly' : 'parliamentary'}`}
                                                className="mt-3 flex items-center gap-2 text-slate-600 hover:text-indigo-600"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                {constituency.name}, {constituency.state.name}
                                            </Link>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                                            {politician.education && (
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap className="h-4 w-4" />
                                                    {politician.education}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                In office since {new Date(politician.termStartDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Score */}
                                <div className="md:ml-auto">
                                    <div className={`p-6 rounded-2xl bg-gradient-to-br ${getPerformanceColor(governanceStats.performanceLevel)} text-white text-center`}>
                                        <div className="text-5xl font-bold mb-1">{governanceStats.performanceScore}</div>
                                        <div className="text-sm opacity-80">Governance Score</div>
                                        <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                                            {governanceStats.performanceLevel}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {politician.biography && (
                                <p className="mt-6 text-slate-600 border-t pt-6">{politician.biography}</p>
                            )}
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
                                            {governanceStats.totalComplaints.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-slate-500">Total Complaints</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{governanceStats.resolutionRate}%</div>
                                        <div className="text-sm text-slate-500">Resolved</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{governanceStats.avgResponseTimeDays}</div>
                                        <div className="text-sm text-slate-500">Avg Days</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{governanceStats.termDurationYears}</div>
                                        <div className="text-sm text-slate-500">Years in Office</div>
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
                                    <CardTitle>Recent Complaints in Constituency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentComplaints.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentComplaints.map((complaint) => (
                                                <div key={complaint.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 truncate">{complaint.title}</p>
                                                        <p className="text-sm text-slate-500">{complaint.department.name}</p>
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

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Governance Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Governance Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">On-time Resolution</span>
                                        <span className="font-semibold">{governanceStats.onTimeResolutionRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Pending Issues</span>
                                        <span className="font-semibold">{governanceStats.pendingComplaints}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Escalated Cases</span>
                                        <span className={`font-semibold ${governanceStats.escalatedComplaints > 0 ? 'text-red-600' : ''}`}>
                                            {governanceStats.escalatedComplaints}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Escalation Rate</span>
                                        <span className={`font-semibold ${governanceStats.escalationRate > 20 ? 'text-red-600' : ''}`}>
                                            {governanceStats.escalationRate}%
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Party Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Political Party</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Link href={`/parties/${politician.party.id}`}>
                                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                                                style={{ backgroundColor: politician.party.color || '#6B7280' }}
                                            >
                                                {politician.party.shortName.slice(0, 2)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">{politician.party.name}</p>
                                                <p className="text-sm text-slate-500">{politician.party.shortName}</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Constituency Quick View */}
                            {constituency && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Constituency</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Link href={`/constituencies/${constituency.id}?type=${politician.seatType === 'MLA' ? 'assembly' : 'parliamentary'}`}>
                                            <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                                <p className="font-semibold text-slate-900">{constituency.name}</p>
                                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {constituency.state.name}
                                                </p>
                                                {constituency.reservationStatus !== 'GENERAL' && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                                        {constituency.reservationStatus}
                                                    </span>
                                                )}
                                                <p className="text-sm text-slate-500 mt-2">
                                                    {constituency.wards.length} wards
                                                </p>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Disclaimer */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> This report card is based on complaint resolution data
                                    in the representative's constituency. Metrics reflect service delivery
                                    outcomes, not political performance.
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
