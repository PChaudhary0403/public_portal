"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Plus,
    Search,
    Filter,
    Eye,
    ArrowUpRight,
    Star,
    Loader2
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingDialog } from "@/components/ui/rating"
import { formatDate, getStatusColor } from "@/lib/utils"

interface Complaint {
    id: string
    ticketNumber: string
    title: string
    status: string
    priority: string
    createdAt: string
    department: {
        name: string
    }
    city: {
        name: string
    }
    assignedAuthority?: {
        id: string
        designation: string
        user: { name: string }
    }
    satisfactionRating?: {
        rating: number
    }
}

interface DashboardStats {
    total: number
    pending: number
    inProgress: number
    resolved: number
    escalated: number
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [loading, setLoading] = useState(true)

    // Rating dialog state
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/login?callbackUrl=/dashboard")
        }
        if (status === "authenticated") {
            fetchComplaints()
        }
    }, [status])

    const fetchComplaints = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/complaints")
            if (response.ok) {
                const data = await response.json()
                // API returns { complaints, pagination } - extract the array
                setComplaints(data.complaints || [])
            }
        } catch (error) {
            console.error("Failed to fetch complaints:", error)
        } finally {
            setLoading(false)
        }
    }

    const openRatingDialog = (complaint: Complaint) => {
        setSelectedComplaint(complaint)
        setRatingDialogOpen(true)
    }

    // Calculate stats
    const stats: DashboardStats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === "SUBMITTED" || c.status === "VIEWED").length,
        inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
        resolved: complaints.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length,
        escalated: complaints.filter(c => c.status === "ESCALATED").length,
    }

    // Filter complaints
    useEffect(() => {
        let filtered = complaints

        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (activeTab !== "all") {
            const statusMap: Record<string, string[]> = {
                pending: ["SUBMITTED", "VIEWED"],
                progress: ["IN_PROGRESS"],
                resolved: ["RESOLVED", "CLOSED"],
                escalated: ["ESCALATED"]
            }
            filtered = filtered.filter(c => statusMap[activeTab]?.includes(c.status))
        }

        setFilteredComplaints(filtered)
    }, [searchQuery, activeTab, complaints])

    // Check if complaint can be rated
    const canRate = (complaint: Complaint) => {
        return (complaint.status === "RESOLVED" || complaint.status === "CLOSED")
            && !complaint.satisfactionRating
            && complaint.assignedAuthority
    }

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Welcome, {session?.user?.name || "Citizen"}
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Track and manage your grievances from here
                            </p>
                        </div>
                        <Link href="/file-complaint">
                            <Button size="lg">
                                <Plus className="mr-2 h-5 w-5" />
                                File New Complaint
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Total</p>
                                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Pending</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">In Progress</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Resolved</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Escalated</p>
                                        <p className="text-2xl font-bold text-orange-600">{stats.escalated}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Complaints List */}
                    <Card variant="elevated">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <CardTitle>Your Complaints</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search by title or ticket..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                                    <TabsTrigger value="progress">In Progress ({stats.inProgress})</TabsTrigger>
                                    <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
                                    <TabsTrigger value="escalated">Escalated ({stats.escalated})</TabsTrigger>
                                </TabsList>

                                <TabsContent value={activeTab} className="space-y-4">
                                    {filteredComplaints.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                            <p className="text-slate-500">No complaints found</p>
                                            <Link href="/file-complaint" className="inline-block mt-4">
                                                <Button>File New Complaint</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        filteredComplaints.map((complaint) => (
                                            <div
                                                key={complaint.id}
                                                className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-mono text-indigo-600">
                                                                {complaint.ticketNumber}
                                                            </span>
                                                            <Badge className={getStatusColor(complaint.status)}>
                                                                {complaint.status.replace("_", " ")}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="font-medium text-slate-900 mb-1">
                                                            {complaint.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                            <span>{complaint.department.name}</span>
                                                            <span>•</span>
                                                            <span>{complaint.city.name}</span>
                                                            <span>•</span>
                                                            <span>{formatDate(complaint.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {canRate(complaint) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openRatingDialog(complaint)}
                                                                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                                            >
                                                                <Star className="mr-2 h-4 w-4" />
                                                                Rate
                                                            </Button>
                                                        )}
                                                        {complaint.satisfactionRating && (
                                                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-md">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-sm font-medium text-yellow-700">
                                                                    {complaint.satisfactionRating.rating}/5
                                                                </span>
                                                            </div>
                                                        )}
                                                        <Link href={`/complaints/${complaint.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/track?ticket=${complaint.ticketNumber}`}>
                                                            <Button size="sm" variant="ghost">
                                                                <ArrowUpRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />

            {/* Rating Dialog */}
            {selectedComplaint && (
                <RatingDialog
                    open={ratingDialogOpen}
                    onOpenChange={setRatingDialogOpen}
                    complaintId={selectedComplaint.id}
                    complaintTitle={selectedComplaint.title}
                    authorityName={selectedComplaint.assignedAuthority?.user.name}
                    onRatingSubmitted={() => fetchComplaints()}
                />
            )}
        </div>
    )
}
