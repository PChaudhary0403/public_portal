"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Star,
    CheckCircle2,
    Clock,
    TrendingUp,
    Building2,
    MapPin,
    Calendar,
    Award,
    FileText,
    Users,
    ArrowLeft,
    Loader2
} from "lucide-react"
import Link from "next/link"

interface AuthorityProfile {
    profile: {
        id: string
        name: string
        email: string
        designation: string
        level: number
        department: { id: string; name: string; icon: string; color: string }
        jurisdiction: string
        joinedAt: string
        isActive: boolean
    }
    stats: {
        totalComplaints: number
        resolvedComplaints: number
        pendingComplaints: number
        resolutionRate: number
        performanceScore: number
        averageRating: number
        totalRatings: number
        avgResolutionDays: number
        ratingDistribution: { [key: number]: number }
    }
    recentWork: Array<{
        id: string
        ticketNumber: string
        title: string
        status: string
        priority: string
        createdAt: string
        resolvedAt: string
        department: { name: string }
        city: { name: string }
        satisfactionRating?: { rating: number; feedback: string }
    }>
}

export default function PublicAuthorityProfilePage() {
    const params = useParams()
    const authorityId = params.id as string
    const [profile, setProfile] = useState<AuthorityProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (authorityId) {
            fetchProfile()
        }
    }, [authorityId])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/authorities/${authorityId}/profile`)
            if (response.ok) {
                const data = await response.json()
                setProfile(data)
            } else {
                setError("Authority not found")
            }
        } catch (err) {
            setError("Failed to load profile")
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
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                ))}
            </div>
        )
    }

    const getLevelBadge = (level: number) => {
        const levels: Record<number, { label: string; color: string }> = {
            1: { label: "Junior Officer", color: "bg-blue-100 text-blue-700" },
            2: { label: "Senior Officer", color: "bg-purple-100 text-purple-700" },
            3: { label: "Commissioner", color: "bg-orange-100 text-orange-700" },
            4: { label: "District Head", color: "bg-red-100 text-red-700" }
        }
        const l = levels[level] || levels[1]
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${l.color}`}>{l.label}</span>
    }

    const getPerformanceBadge = (score: number) => {
        if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>
        if (score >= 60) return <Badge className="bg-blue-500">Good</Badge>
        if (score >= 40) return <Badge className="bg-yellow-500">Average</Badge>
        return <Badge className="bg-red-500">Needs Improvement</Badge>
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h1>
                        <p className="text-slate-500 mb-4">{error || "This authority profile does not exist."}</p>
                        <Link href="/leaderboard">
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                View All Authorities
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { profile: p, stats, recentWork } = profile

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    {/* Back Button */}
                    <Link href="/leaderboard" className="inline-flex items-center text-sm text-slate-600 hover:text-indigo-600 mb-6">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Leaderboard
                    </Link>

                    {/* Profile Header */}
                    <Card className="mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-32" />
                        <CardContent className="relative pt-0 pb-6">
                            <div className="flex flex-col lg:flex-row lg:items-end gap-4 -mt-12">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                                    {p.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1 pt-4 lg:pt-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-slate-900">{p.name}</h1>
                                        {p.isActive && (
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active" />
                                        )}
                                        {getPerformanceBadge(stats.performanceScore)}
                                    </div>
                                    <p className="text-slate-600 mb-2">{p.designation}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            {p.department.name}
                                        </span>
                                        {p.jurisdiction && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {p.jurisdiction}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Joined {new Date(p.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Level Badge */}
                                <div className="lg:text-right">
                                    {getLevelBadge(p.level)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Stats Column */}
                        <div className="space-y-6">
                            {/* Performance Score */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Award className="h-5 w-5 text-indigo-600" />
                                        Performance Score
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-indigo-600 mb-2">
                                            {stats.performanceScore}
                                        </div>
                                        <p className="text-sm text-slate-500">out of 100</p>
                                        <Progress value={stats.performanceScore} className="mt-4" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Rating Card */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        Citizen Ratings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-slate-900 mb-1">
                                            {stats.averageRating.toFixed(1)}
                                        </div>
                                        <div className="flex justify-center mb-1">
                                            {renderStars(Math.round(stats.averageRating))}
                                        </div>
                                        <p className="text-sm text-slate-500">{stats.totalRatings} reviews</p>
                                    </div>

                                    {/* Rating Distribution */}
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = stats.ratingDistribution[star] || 0
                                            const percentage = stats.totalRatings > 0
                                                ? (count / stats.totalRatings) * 100
                                                : 0
                                            return (
                                                <div key={star} className="flex items-center gap-2">
                                                    <span className="text-sm w-3">{star}</span>
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400 rounded-full transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-slate-500 w-8">{count}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Total Cases
                                        </span>
                                        <span className="font-semibold">{stats.totalComplaints}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            Resolved
                                        </span>
                                        <span className="font-semibold text-green-600">{stats.resolvedComplaints}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                            Pending
                                        </span>
                                        <span className="font-semibold text-yellow-600">{stats.pendingComplaints}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-blue-500" />
                                            Resolution Rate
                                        </span>
                                        <span className="font-semibold text-blue-600">{stats.resolutionRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Avg. Resolution Time
                                        </span>
                                        <span className="font-semibold">{stats.avgResolutionDays} days</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Work Column - 2 cols */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        Recent Resolved Cases
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentWork.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500">No resolved cases yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentWork.map((complaint) => (
                                                <div
                                                    key={complaint.id}
                                                    className="p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-sm text-indigo-600">
                                                                    {complaint.ticketNumber}
                                                                </span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {complaint.department.name}
                                                                </Badge>
                                                            </div>
                                                            <h3 className="font-medium text-slate-900 mb-1">
                                                                {complaint.title}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    {complaint.city.name}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    Resolved {complaint.resolvedAt
                                                                        ? new Date(complaint.resolvedAt).toLocaleDateString()
                                                                        : "N/A"
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Rating */}
                                                        {complaint.satisfactionRating && (
                                                            <div className="flex flex-col items-end">
                                                                {renderStars(complaint.satisfactionRating.rating)}
                                                                {complaint.satisfactionRating.feedback && (
                                                                    <p className="text-xs text-slate-500 mt-1 max-w-[200px] text-right italic">
                                                                        "{complaint.satisfactionRating.feedback}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
