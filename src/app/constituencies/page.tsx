"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    Filter
} from "lucide-react"

interface ConstituencyData {
    id: string
    name: string
    constituencyNumber?: number
    reservationStatus: string
    totalVoters?: number
    state: { id: string; name: string; code: string }
    politicians: Array<{
        id: string
        name: string
        party: { id: string; name: string; shortName: string; color: string | null }
    }>
    _count: { complaints: number; wards: number }
    type: 'assembly' | 'parliamentary'
    metrics: {
        totalComplaints: number
        resolvedComplaints: number
        resolutionRate: number
        onTimeResolutionRate: number
        escalationRate: number
        avgResponseTimeDays: number
        departmentBreakdown: Array<{
            departmentName: string
            resolutionRate: number
        }>
    }
}

export default function ConstituenciesPage() {
    const [loading, setLoading] = useState(true)
    const [assemblyConstituencies, setAssemblyConstituencies] = useState<ConstituencyData[]>([])
    const [parliamentaryConstituencies, setParliamentaryConstituencies] = useState<ConstituencyData[]>([])
    const [activeTab, setActiveTab] = useState<'all' | 'assembly' | 'parliamentary'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'complaints' | 'resolution'>('complaints')

    useEffect(() => {
        fetchConstituencies()
    }, [])

    const fetchConstituencies = async () => {
        try {
            const res = await fetch('/api/constituencies')
            if (res.ok) {
                const data = await res.json()
                setAssemblyConstituencies(data.assemblyConstituencies || [])
                setParliamentaryConstituencies(data.parliamentaryConstituencies || [])
            }
        } catch (error) {
            console.error('Failed to fetch constituencies:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPerformanceColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-100'
        if (score >= 60) return 'text-blue-600 bg-blue-100'
        if (score >= 40) return 'text-amber-600 bg-amber-100'
        return 'text-red-600 bg-red-100'
    }

    const getPerformanceLabel = (score: number) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Average'
        return 'Needs Improvement'
    }

    const getDisplayConstituencies = () => {
        let constituencies: ConstituencyData[] = []

        if (activeTab === 'assembly') {
            constituencies = assemblyConstituencies
        } else if (activeTab === 'parliamentary') {
            constituencies = parliamentaryConstituencies
        } else {
            constituencies = [...assemblyConstituencies, ...parliamentaryConstituencies]
        }

        // Sort
        return constituencies.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            if (sortBy === 'complaints') return b.metrics.totalComplaints - a.metrics.totalComplaints
            if (sortBy === 'resolution') return b.metrics.resolutionRate - a.metrics.resolutionRate
            return 0
        })
    }

    const totalComplaints = [...assemblyConstituencies, ...parliamentaryConstituencies]
        .reduce((acc, c) => acc + c.metrics.totalComplaints, 0)
    const avgResolutionRate = [...assemblyConstituencies, ...parliamentaryConstituencies].length > 0
        ? Math.round(
            [...assemblyConstituencies, ...parliamentaryConstituencies]
                .reduce((acc, c) => acc + c.metrics.resolutionRate, 0) /
            [...assemblyConstituencies, ...parliamentaryConstituencies].length
        )
        : 0

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

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Link href="/" className="hover:text-indigo-600">Home</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-slate-900">Constituency Report Cards</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Constituency Governance Report Cards
                        </h1>
                        <p className="text-slate-600 max-w-3xl">
                            Transparent performance metrics for every constituency based on actual complaint resolution outcomes.
                            View how well your area's governance is performing.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Vote className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Assembly Seats</p>
                                        <p className="text-2xl font-bold">{assemblyConstituencies.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Parliamentary Seats</p>
                                        <p className="text-2xl font-bold">{parliamentaryConstituencies.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Total Complaints</p>
                                        <p className="text-2xl font-bold">{totalComplaints.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Avg Resolution Rate</p>
                                        <p className="text-2xl font-bold">{avgResolutionRate}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === 'all' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('all')}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={activeTab === 'assembly' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('assembly')}
                                size="sm"
                            >
                                <Vote className="h-4 w-4 mr-1" />
                                Assembly (MLA)
                            </Button>
                            <Button
                                variant={activeTab === 'parliamentary' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('parliamentary')}
                                size="sm"
                            >
                                <Building2 className="h-4 w-4 mr-1" />
                                Parliamentary (MP)
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="complaints">Most Complaints</SelectItem>
                                    <SelectItem value="resolution">Best Resolution Rate</SelectItem>
                                    <SelectItem value="name">Name (A-Z)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Constituency Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getDisplayConstituencies().map((constituency) => (
                            <Link
                                key={constituency.id}
                                href={`/constituencies/${constituency.id}?type=${constituency.type}`}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {constituency.type === 'assembly' ? (
                                                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                                                        <Vote className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                                                        <Building2 className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                )}
                                                <span className="text-xs font-medium text-slate-500 uppercase">
                                                    {constituency.type === 'assembly' ? 'MLA' : 'MP'} Constituency
                                                </span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(constituency.metrics.resolutionRate)}`}>
                                                {getPerformanceLabel(constituency.metrics.resolutionRate)}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                                            {constituency.name}
                                        </CardTitle>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {constituency.state.name}
                                            {constituency.reservationStatus !== 'GENERAL' && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                                    {constituency.reservationStatus}
                                                </span>
                                            )}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {/* Current Representative */}
                                        {constituency.politicians[0] && (
                                            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                                <p className="text-xs text-slate-500 mb-1">Current Representative</p>
                                                <p className="font-medium text-slate-900">{constituency.politicians[0].name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: constituency.politicians[0].party.color || '#6B7280' }}
                                                    />
                                                    <span className="text-sm text-slate-600">
                                                        {constituency.politicians[0].party.shortName}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-blue-50 rounded">
                                                    <Users className="h-3.5 w-3.5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Complaints</p>
                                                    <p className="font-semibold text-slate-900">
                                                        {constituency.metrics.totalComplaints.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-emerald-50 rounded">
                                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Resolved</p>
                                                    <p className="font-semibold text-slate-900">
                                                        {constituency.metrics.resolutionRate}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-amber-50 rounded">
                                                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Avg Time</p>
                                                    <p className="font-semibold text-slate-900">
                                                        {constituency.metrics.avgResponseTimeDays} days
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded ${constituency.metrics.escalationRate > 20 ? 'bg-red-50' : 'bg-slate-50'}`}>
                                                    <AlertTriangle className={`h-3.5 w-3.5 ${constituency.metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-400'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Escalation</p>
                                                    <p className={`font-semibold ${constituency.metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-900'}`}>
                                                        {constituency.metrics.escalationRate}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {getDisplayConstituencies().length === 0 && (
                        <div className="text-center py-12">
                            <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No constituencies found</h3>
                            <p className="text-slate-500">No data available for the selected filters.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
