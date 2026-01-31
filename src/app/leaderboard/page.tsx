"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Star,
    Trophy,
    Medal,
    Search,
    Filter,
    TrendingUp,
    CheckCircle2,
    Users,
    Loader2,
    ChevronRight,
    Building2,
    Sparkles
} from "lucide-react"
import Link from "next/link"

interface Authority {
    id: string
    name: string
    email: string
    designation: string
    department: string
    departmentId: string
    level: number
    isActive: boolean
    totalComplaints: number
    resolvedComplaints: number
    performanceScore: number
    averageRating: number
    totalRatings: number
}

export default function LeaderboardPage() {
    const [authorities, setAuthorities] = useState<Authority[]>([])
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [sortBy, setSortBy] = useState<"rating" | "performance" | "resolved">("performance")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [authRes, deptRes] = await Promise.all([
                fetch("/api/authorities/leaderboard"),
                fetch("/api/departments")
            ])

            if (authRes.ok) {
                const data = await authRes.json()
                setAuthorities(data)
            }
            if (deptRes.ok) {
                const data = await deptRes.json()
                setDepartments(data)
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                ))}
            </div>
        )
    }

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"><Trophy className="h-4 w-4 text-white" /></div>
        if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center"><Medal className="h-4 w-4 text-white" /></div>
        if (rank === 3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"><Medal className="h-4 w-4 text-white" /></div>
        return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">#{rank}</div>
    }

    // Filter and sort
    const filteredAuthorities = authorities
        .filter(auth => {
            const matchesSearch =
                auth.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                auth.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                auth.department?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesDept = departmentFilter === "all" || auth.departmentId === departmentFilter
            return matchesSearch && matchesDept
        })
        .sort((a, b) => {
            if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0)
            if (sortBy === "resolved") return (b.resolvedComplaints || 0) - (a.resolvedComplaints || 0)
            return (b.performanceScore || 0) - (a.performanceScore || 0)
        })

    // Top 3 for showcase
    const top3 = [...authorities]
        .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
        .slice(0, 3)

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 mb-4">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">Public Authority Performance</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            Authority Leaderboard
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Discover top-performing government officials. View their ratings,
                            resolved cases, and track record of public service.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <>
                            {/* Top 3 Showcase */}
                            {top3.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    {top3.map((auth, index) => (
                                        <Link key={auth.id} href={`/authority/${auth.id}`}>
                                            <Card className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${index === 0 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50' :
                                                    index === 1 ? 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100' :
                                                        'border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50'
                                                }`}>
                                                <div className="absolute top-3 right-3">
                                                    {getRankBadge(index + 1)}
                                                </div>
                                                <CardContent className="pt-8 pb-6 text-center">
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                                                        {auth.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <h3 className="font-semibold text-lg text-slate-900">{auth.name}</h3>
                                                    <p className="text-sm text-slate-500 mb-2">{auth.designation}</p>
                                                    <Badge variant="outline" className="mb-3">{auth.department}</Badge>

                                                    <div className="flex justify-center gap-1 mb-2">
                                                        {renderStars(Math.round(auth.averageRating || 0))}
                                                        <span className="text-sm text-slate-600 ml-1">
                                                            {(auth.averageRating || 0).toFixed(1)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-center items-center gap-4 text-sm text-slate-600">
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            {auth.resolvedComplaints}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <TrendingUp className="h-4 w-4 text-blue-500" />
                                                            {(auth.performanceScore || 0).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Filters */}
                            <Card className="mb-6">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Search by name, designation..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                            <SelectTrigger className="w-full md:w-[200px]">
                                                <Building2 className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {departments.map(d => (
                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                                            <SelectTrigger className="w-full md:w-[180px]">
                                                <Filter className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="performance">Performance Score</SelectItem>
                                                <SelectItem value="rating">Average Rating</SelectItem>
                                                <SelectItem value="resolved">Cases Resolved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Full List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                        All Authorities ({filteredAuthorities.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {filteredAuthorities.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500">No authorities found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredAuthorities.map((auth, index) => (
                                                <Link key={auth.id} href={`/authority/${auth.id}`}>
                                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                                                        {/* Rank */}
                                                        {getRankBadge(index + 1)}

                                                        {/* Avatar */}
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                            {auth.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-slate-900 truncate">{auth.name}</h3>
                                                            <p className="text-sm text-slate-500 truncate">{auth.designation}</p>
                                                        </div>

                                                        {/* Department */}
                                                        <Badge variant="outline" className="hidden sm:flex">
                                                            {auth.department}
                                                        </Badge>

                                                        {/* Stats */}
                                                        <div className="hidden md:flex items-center gap-6 text-sm">
                                                            <div className="text-center">
                                                                <div className="flex items-center gap-1">
                                                                    {renderStars(Math.round(auth.averageRating || 0))}
                                                                </div>
                                                                <p className="text-xs text-slate-500">{auth.totalRatings || 0} reviews</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="font-semibold text-green-600">{auth.resolvedComplaints || 0}</p>
                                                                <p className="text-xs text-slate-500">Resolved</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="font-semibold text-blue-600">{(auth.performanceScore || 0).toFixed(0)}%</p>
                                                                <p className="text-xs text-slate-500">Score</p>
                                                            </div>
                                                        </div>

                                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
