"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    Filter,
    MapPin,
    Award
} from "lucide-react"

interface PoliticianData {
    id: string
    name: string
    gender: string
    education?: string
    seatType: 'MLA' | 'MP'
    termStartDate: string
    isCurrentlyServing: boolean
    party: {
        id: string
        name: string
        shortName: string
        color: string | null
    }
    assemblyConstituency?: {
        id: string
        name: string
        state: { name: string; code: string }
        _count: { complaints: number }
    }
    parliamentaryConstituency?: {
        id: string
        name: string
        state: { name: string; code: string }
        _count: { complaints: number }
    }
    metrics: {
        totalComplaints: number
        resolvedComplaints: number
        resolutionRate: number
        onTimeResolutionRate: number
        escalationRate: number
        avgResponseTimeDays: number
        performanceScore: number
    } | null
}

export default function PoliticiansPage() {
    const [loading, setLoading] = useState(true)
    const [politicians, setPoliticians] = useState<PoliticianData[]>([])
    const [seatTypeFilter, setSeatTypeFilter] = useState<'all' | 'MLA' | 'MP'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'performance' | 'complaints'>('performance')

    useEffect(() => {
        fetchPoliticians()
    }, [])

    const fetchPoliticians = async () => {
        try {
            const res = await fetch('/api/politicians')
            if (res.ok) {
                const data = await res.json()
                setPoliticians(data.politicians || [])
            }
        } catch (error) {
            console.error('Failed to fetch politicians:', error)
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

    const getPerformanceGradient = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-green-600'
        if (score >= 60) return 'from-blue-500 to-indigo-600'
        if (score >= 40) return 'from-amber-500 to-orange-600'
        return 'from-red-500 to-rose-600'
    }

    const getDisplayPoliticians = () => {
        let filtered = politicians

        if (seatTypeFilter !== 'all') {
            filtered = filtered.filter(p => p.seatType === seatTypeFilter)
        }

        return filtered.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            if (sortBy === 'performance') {
                return (b.metrics?.performanceScore || 0) - (a.metrics?.performanceScore || 0)
            }
            if (sortBy === 'complaints') {
                return (b.metrics?.totalComplaints || 0) - (a.metrics?.totalComplaints || 0)
            }
            return 0
        })
    }

    const mlaCount = politicians.filter(p => p.seatType === 'MLA').length
    const mpCount = politicians.filter(p => p.seatType === 'MP').length
    const avgPerformance = politicians.length > 0
        ? Math.round(
            politicians.reduce((acc, p) => acc + (p.metrics?.performanceScore || 0), 0) / politicians.length
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
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Link href="/" className="hover:text-indigo-600">Home</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-slate-900">Elected Representatives</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Elected Representatives Report Cards
                        </h1>
                        <p className="text-slate-600 max-w-3xl">
                            Performance metrics for elected representatives based on complaint resolution outcomes
                            in their constituencies. These are factual service delivery indicators.
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
                                        <p className="text-sm opacity-80">MLAs</p>
                                        <p className="text-2xl font-bold">{mlaCount}</p>
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
                                        <p className="text-sm opacity-80">MPs</p>
                                        <p className="text-2xl font-bold">{mpCount}</p>
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
                                        <p className="text-sm opacity-80">Total Representatives</p>
                                        <p className="text-2xl font-bold">{politicians.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Avg Performance</p>
                                        <p className="text-2xl font-bold">{avgPerformance}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex gap-2">
                            <Button
                                variant={seatTypeFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setSeatTypeFilter('all')}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={seatTypeFilter === 'MLA' ? 'default' : 'outline'}
                                onClick={() => setSeatTypeFilter('MLA')}
                                size="sm"
                            >
                                <Vote className="h-4 w-4 mr-1" />
                                MLAs
                            </Button>
                            <Button
                                variant={seatTypeFilter === 'MP' ? 'default' : 'outline'}
                                onClick={() => setSeatTypeFilter('MP')}
                                size="sm"
                            >
                                <Building2 className="h-4 w-4 mr-1" />
                                MPs
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="performance">Best Performance</SelectItem>
                                    <SelectItem value="complaints">Most Complaints</SelectItem>
                                    <SelectItem value="name">Name (A-Z)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Politicians Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getDisplayPoliticians().map((politician) => {
                            const constituency = politician.seatType === 'MLA'
                                ? politician.assemblyConstituency
                                : politician.parliamentaryConstituency

                            return (
                                <Link key={politician.id} href={`/politicians/${politician.id}`}>
                                    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
                                        {/* Header with party color */}
                                        <div
                                            className="h-2"
                                            style={{ backgroundColor: politician.party.color || '#6B7280' }}
                                        />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <div
                                                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${getPerformanceGradient(politician.metrics?.performanceScore || 0)} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}
                                                >
                                                    {politician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors truncate">
                                                        {politician.name}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span
                                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: politician.party.color || '#6B7280' }}
                                                        />
                                                        <span className="text-sm text-slate-600 truncate">
                                                            {politician.party.shortName}
                                                        </span>
                                                        <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${politician.seatType === 'MLA'
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                            {politician.seatType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            {/* Constituency Info */}
                                            {constituency && (
                                                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500 mb-1">Constituency</p>
                                                    <p className="font-medium text-slate-900 truncate">{constituency.name}</p>
                                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {constituency.state.name}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Performance Score */}
                                            {politician.metrics && (
                                                <>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-sm text-slate-500">Performance Score</span>
                                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPerformanceColor(politician.metrics.performanceScore)}`}>
                                                            {politician.metrics.performanceScore}/100
                                                        </span>
                                                    </div>

                                                    {/* Metrics Grid */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-blue-50 rounded">
                                                                <Users className="h-3.5 w-3.5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500">Complaints</p>
                                                                <p className="font-semibold text-slate-900">
                                                                    {politician.metrics.totalComplaints.toLocaleString()}
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
                                                                    {politician.metrics.resolutionRate}%
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
                                                                    {politician.metrics.avgResponseTimeDays} days
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded ${politician.metrics.escalationRate > 20 ? 'bg-red-50' : 'bg-slate-50'}`}>
                                                                <AlertTriangle className={`h-3.5 w-3.5 ${politician.metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-400'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500">Escalation</p>
                                                                <p className={`font-semibold ${politician.metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-900'}`}>
                                                                    {politician.metrics.escalationRate}%
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>

                    {getDisplayPoliticians().length === 0 && (
                        <div className="text-center py-12">
                            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No representatives found</h3>
                            <p className="text-slate-500">No data available for the selected filters.</p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Disclaimer:</strong> Performance metrics are based solely on complaint resolution
                            outcomes in each representative's constituency. This data represents service delivery
                            efficiency and is not a political endorsement or criticism.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
