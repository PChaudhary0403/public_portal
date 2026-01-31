"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    Award,
    Flag
} from "lucide-react"

interface PartyData {
    id: string
    name: string
    shortName: string
    symbol?: string
    color: string | null
    logoUrl?: string
    foundedYear?: number
    ideology?: string
    seatsHeld: {
        mla: number
        mp: number
        total: number
    }
    metrics: {
        totalComplaints: number
        resolvedComplaints: number
        resolutionRate: number
        onTimeResolutionRate: number
        escalationRate: number
        avgResponseTimeDays: number
        performanceScore: number
        bestPerformingDept: string
        worstPerformingDept: string
    }
    topDepartments: Array<{
        departmentSlug: string
        departmentName: string
        resolutionRate: number
    }>
}

export default function PartiesPage() {
    const [loading, setLoading] = useState(true)
    const [parties, setParties] = useState<PartyData[]>([])
    const [summary, setSummary] = useState({
        totalMlaSeats: 0,
        totalMpSeats: 0,
        avgResolutionRate: 0
    })

    useEffect(() => {
        fetchParties()
    }, [])

    const fetchParties = async () => {
        try {
            const res = await fetch('/api/parties')
            if (res.ok) {
                const data = await res.json()
                setParties(data.parties || [])
                setSummary(data.summary || { totalMlaSeats: 0, totalMpSeats: 0, avgResolutionRate: 0 })
            }
        } catch (error) {
            console.error('Failed to fetch parties:', error)
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
                            <span className="text-slate-900">Political Parties</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Political Parties Performance
                        </h1>
                        <p className="text-slate-600 max-w-3xl">
                            Aggregated governance metrics across all constituencies held by each party.
                            Compare service delivery performance based on actual complaint resolution data.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Flag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Active Parties</p>
                                        <p className="text-2xl font-bold">{parties.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Vote className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Total MLA Seats</p>
                                        <p className="text-2xl font-bold">{summary.totalMlaSeats}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Total MP Seats</p>
                                        <p className="text-2xl font-bold">{summary.totalMpSeats}</p>
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
                                        <p className="text-sm opacity-80">Avg Resolution</p>
                                        <p className="text-2xl font-bold">{summary.avgResolutionRate}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Party Performance Rankings */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-indigo-600" />
                                Party Performance Rankings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-6">
                                Ranked by overall governance score calculated from resolution rates,
                                on-time delivery, and escalation metrics.
                            </p>
                            <div className="space-y-4">
                                {parties.map((party, index) => (
                                    <Link key={party.id} href={`/parties/${party.id}`}>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                            {/* Rank */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                    index === 1 ? 'bg-slate-200 text-slate-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-slate-100 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </div>

                                            {/* Party Logo/Color */}
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                                                style={{ backgroundColor: party.color || '#6B7280' }}
                                            >
                                                {party.shortName.slice(0, 2)}
                                            </div>

                                            {/* Party Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-slate-900">{party.name}</h3>
                                                    <span className="text-sm text-slate-500">({party.shortName})</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Vote className="h-3.5 w-3.5" />
                                                        {party.seatsHeld.mla} MLAs
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-3.5 w-3.5" />
                                                        {party.seatsHeld.mp} MPs
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        {party.metrics.totalComplaints.toLocaleString()} complaints
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Metrics */}
                                            <div className="hidden md:flex items-center gap-6">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-emerald-600">{party.metrics.resolutionRate}%</div>
                                                    <div className="text-xs text-slate-500">Resolved</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600">{party.metrics.onTimeResolutionRate}%</div>
                                                    <div className="text-xs text-slate-500">On-time</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-amber-600">{party.metrics.avgResponseTimeDays}</div>
                                                    <div className="text-xs text-slate-500">Avg Days</div>
                                                </div>
                                            </div>

                                            {/* Performance Score */}
                                            <div className="text-center">
                                                <div className={`px-3 py-2 rounded-lg ${getPerformanceColor(party.metrics.performanceScore)}`}>
                                                    <div className="text-xl font-bold">{party.metrics.performanceScore}</div>
                                                    <div className="text-xs">{getPerformanceLabel(party.metrics.performanceScore)}</div>
                                                </div>
                                            </div>

                                            <ChevronRight className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Party Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {parties.map((party) => (
                            <Link key={party.id} href={`/parties/${party.id}`}>
                                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
                                    {/* Header with party color */}
                                    <div
                                        className="h-2"
                                        style={{ backgroundColor: party.color || '#6B7280' }}
                                    />
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                                                style={{ backgroundColor: party.color || '#6B7280' }}
                                            >
                                                {party.shortName.slice(0, 2)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors truncate">
                                                    {party.name}
                                                </CardTitle>
                                                <p className="text-sm text-slate-500">{party.shortName}</p>
                                                {party.symbol && (
                                                    <p className="text-xs text-slate-400 mt-1">Symbol: {party.symbol}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {/* Seats Info */}
                                        <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center justify-around">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-indigo-600">{party.seatsHeld.mla}</div>
                                                <div className="text-xs text-slate-500">MLAs</div>
                                            </div>
                                            <div className="w-px h-8 bg-slate-200" />
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-emerald-600">{party.seatsHeld.mp}</div>
                                                <div className="text-xs text-slate-500">MPs</div>
                                            </div>
                                            <div className="w-px h-8 bg-slate-200" />
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-slate-900">{party.seatsHeld.total}</div>
                                                <div className="text-xs text-slate-500">Total</div>
                                            </div>
                                        </div>

                                        {/* Performance Score */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm text-slate-500">Performance Score</span>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPerformanceColor(party.metrics.performanceScore)}`}>
                                                {party.metrics.performanceScore}/100
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
                                                        {party.metrics.totalComplaints.toLocaleString()}
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
                                                        {party.metrics.resolutionRate}%
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
                                                        {party.metrics.avgResponseTimeDays} days
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded ${party.metrics.escalationRate > 20 ? 'bg-red-50' : 'bg-slate-50'}`}>
                                                    <AlertTriangle className={`h-3.5 w-3.5 ${party.metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-400'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Escalation</p>
                                                    <p className={`font-semibold ${party.metrics.escalationRate > 20 ? 'text-red-600' : 'text-slate-900'}`}>
                                                        {party.metrics.escalationRate}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {parties.length === 0 && (
                        <div className="text-center py-12">
                            <Flag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No parties found</h3>
                            <p className="text-slate-500">No party data available.</p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Disclaimer:</strong> Party performance is aggregated from complaint resolution
                            data across all constituencies held by that party's representatives. This represents
                            service delivery efficiency and is not a political assessment.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
