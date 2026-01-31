"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Users,
    Eye,
    MessageSquare,
    Star,
    ArrowUpRight,
    Loader2
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDate, getStatusColor } from "@/lib/utils"

interface AuthorityStats {
    totalAssigned: number
    pending: number
    inProgress: number
    resolved: number
    avgResponseTime: string
    performanceScore: number
}

interface AssignedComplaint {
    id: string
    ticketNumber: string
    title: string
    status: string
    priority: string
    createdAt: string
    citizen: { name: string }
    city: { name: string }
    ward: { number: number } | null
}

const mockStats: AuthorityStats = {
    totalAssigned: 45,
    pending: 8,
    inProgress: 12,
    resolved: 25,
    avgResponseTime: "2.5 days",
    performanceScore: 85
}

const mockComplaints: AssignedComplaint[] = [
    {
        id: "1",
        ticketNumber: "GRV-M9X8Y7-ABCD",
        title: "Pothole on Main Road near Market",
        status: "IN_PROGRESS",
        priority: "HIGH",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        citizen: { name: "John Doe" },
        city: { name: "Prayagraj" },
        ward: { number: 14 }
    },
    {
        id: "2",
        ticketNumber: "GRV-K7L8M9-EFGH",
        title: "Road cave-in near Railway Station",
        status: "SUBMITTED",
        priority: "URGENT",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        citizen: { name: "Jane Smith" },
        city: { name: "Prayagraj" },
        ward: { number: 7 }
    },
    {
        id: "3",
        ticketNumber: "GRV-P2Q3R4-IJKL",
        title: "Speed breaker damaged on NH-2",
        status: "VIEWED",
        priority: "MEDIUM",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        citizen: { name: "Ram Kumar" },
        city: { name: "Prayagraj" },
        ward: null
    },
    {
        id: "4",
        ticketNumber: "GRV-S5T6U7-MNOP",
        title: "Road marking faded on Ring Road",
        status: "RESOLVED",
        priority: "LOW",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        citizen: { name: "Priya Sharma" },
        city: { name: "Prayagraj" },
        ward: { number: 21 }
    }
]

export default function AuthorityDashboard() {
    const { data: session, status } = useSession()
    const [stats] = useState<AuthorityStats>(mockStats)
    const [complaints, setComplaints] = useState<AssignedComplaint[]>(mockComplaints)
    const [activeTab, setActiveTab] = useState("pending")
    const [loading, setLoading] = useState(true)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState<AssignedComplaint | null>(null)
    const [newStatus, setNewStatus] = useState("")
    const [notes, setNotes] = useState("")
    const [updating, setUpdating] = useState(false)

    // Redirect if not authority
    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/login?callbackUrl=/authority")
        }
        // In real app, also check if user.role === "AUTHORITY"
    }, [status])

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const filteredComplaints = complaints.filter(c => {
        switch (activeTab) {
            case "pending":
                return c.status === "SUBMITTED" || c.status === "VIEWED"
            case "progress":
                return c.status === "IN_PROGRESS"
            case "resolved":
                return c.status === "RESOLVED" || c.status === "CLOSED"
            default:
                return true
        }
    })

    const handleOpenUpdate = (complaint: AssignedComplaint) => {
        setSelectedComplaint(complaint)
        setNewStatus(complaint.status)
        setNotes("")
        setUpdateDialogOpen(true)
    }

    const handleUpdateStatus = async () => {
        if (!selectedComplaint || !newStatus) return

        setUpdating(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setComplaints(prev =>
            prev.map(c =>
                c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
            )
        )

        setUpdating(false)
        setUpdateDialogOpen(false)
    }

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            LOW: "bg-gray-100 text-gray-700",
            MEDIUM: "bg-blue-100 text-blue-700",
            HIGH: "bg-orange-100 text-orange-700",
            URGENT: "bg-red-100 text-red-700"
        }
        return colors[priority] || colors.MEDIUM
    }

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Authority Dashboard
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Manage and resolve assigned complaints
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Total</p>
                                        <p className="text-2xl font-bold text-slate-900">{stats.totalAssigned}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-indigo-200" />
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
                                    <Clock className="h-8 w-8 text-blue-200" />
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
                                    <TrendingUp className="h-8 w-8 text-yellow-200" />
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
                                    <CheckCircle2 className="h-8 w-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="stat-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Avg Response</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="stat-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-indigo-100">Performance</p>
                                        <p className="text-2xl font-bold">{stats.performanceScore}%</p>
                                    </div>
                                    <Star className="h-8 w-8 text-white/30" />
                                </div>
                                <Progress value={stats.performanceScore} className="mt-2 h-2" indicatorColor="bg-white" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Complaints List */}
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Assigned Complaints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="pending">
                                        Pending ({complaints.filter(c => ["SUBMITTED", "VIEWED"].includes(c.status)).length})
                                    </TabsTrigger>
                                    <TabsTrigger value="progress">
                                        In Progress ({complaints.filter(c => c.status === "IN_PROGRESS").length})
                                    </TabsTrigger>
                                    <TabsTrigger value="resolved">
                                        Resolved ({complaints.filter(c => ["RESOLVED", "CLOSED"].includes(c.status)).length})
                                    </TabsTrigger>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                </TabsList>

                                <TabsContent value={activeTab}>
                                    {filteredComplaints.length === 0 ? (
                                        <div className="text-center py-12">
                                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-300 mb-4" />
                                            <p className="text-slate-500">No complaints in this category</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredComplaints.map((complaint) => (
                                                <div
                                                    key={complaint.id}
                                                    className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-white"
                                                >
                                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <span className="text-sm font-mono text-indigo-600">
                                                                    {complaint.ticketNumber}
                                                                </span>
                                                                <Badge className={getStatusColor(complaint.status)}>
                                                                    {complaint.status.replace("_", " ")}
                                                                </Badge>
                                                                <Badge className={getPriorityBadge(complaint.priority)}>
                                                                    {complaint.priority}
                                                                </Badge>
                                                            </div>
                                                            <h3 className="font-medium text-slate-900 mb-1">
                                                                {complaint.title}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="h-3.5 w-3.5" />
                                                                    {complaint.citizen.name}
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    {complaint.ward && `Ward ${complaint.ward.number}, `}
                                                                    {complaint.city.name}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{formatDate(complaint.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleOpenUpdate(complaint)}
                                                            >
                                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                                Update Status
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Update Status Dialog */}
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Complaint Status</DialogTitle>
                        <DialogDescription>
                            Update the status and add notes for complaint {selectedComplaint?.ticketNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VIEWED">Viewed</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes / Action Taken</Label>
                            <Textarea
                                placeholder="Describe the action taken or reason for status change..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStatus} disabled={updating || !newStatus}>
                            {updating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Status"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}
