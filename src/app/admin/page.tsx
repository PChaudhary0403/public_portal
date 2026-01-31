"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Building2,
    MapPin,
    Settings,
    Plus,
    Edit,
    Trash2,
    ChevronRight,
    FileText,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Search,
    Eye,
    Clock,
    Filter
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Department {
    id: string
    name: string
    slug: string
    isActive: boolean
    complaintCount: number
}

interface Authority {
    id: string
    name: string
    email: string
    designation: string
    department: string
    departmentId?: string // Added for editing
    level: number
    jurisdiction: string
    isActive: boolean
}

interface EscalationRule {
    id: string
    department: string
    fromLevel: number
    toLevel: number
    daysToEscalate: number
    isActive: boolean
}

interface Complaint {
    id: string
    ticketNumber: string
    title: string
    status: string
    priority: string
    createdAt: string
    department: { name: string }
    city: { name: string }
    citizen: { name: string; email: string }
    assignedAuthority?: { designation: string; user: { name: string } }
}

const mockDepartments: Department[] = [
    { id: "1", name: "Health & Hospitals", slug: "health-hospitals", isActive: true, complaintCount: 150 },
    { id: "2", name: "Roadways & Transport", slug: "roadways-transport", isActive: true, complaintCount: 320 },
    { id: "3", name: "Water Supply & Drainage", slug: "water-supply", isActive: true, complaintCount: 89 },
    { id: "4", name: "Electricity", slug: "electricity", isActive: true, complaintCount: 210 },
    { id: "5", name: "Municipal Services", slug: "municipal-services", isActive: true, complaintCount: 175 }
]

const mockAuthorities: Authority[] = [
    { id: "1", name: "Rajesh Kumar", email: "rajesh@gov.in", designation: "Junior Engineer", department: "Roadways", level: 1, jurisdiction: "Ward 14, Prayagraj", isActive: true },
    { id: "2", name: "Priya Sharma", email: "priya@gov.in", designation: "Senior Engineer", department: "Roadways", level: 2, jurisdiction: "Prayagraj District", isActive: true },
    { id: "3", name: "Amit Singh", email: "amit@gov.in", designation: "Executive Engineer", department: "Water Supply", level: 1, jurisdiction: "Ward 7-14, Prayagraj", isActive: true }
]

const mockEscalationRules: EscalationRule[] = [
    { id: "1", department: "Roadways & Transport", fromLevel: 1, toLevel: 2, daysToEscalate: 7, isActive: true },
    { id: "2", department: "Roadways & Transport", fromLevel: 2, toLevel: 3, daysToEscalate: 5, isActive: true },
    { id: "3", department: "Water Supply", fromLevel: 1, toLevel: 2, daysToEscalate: 3, isActive: true }
]

export default function AdminPage() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")

    // Data states
    const [departments, setDepartments] = useState<Department[]>([])
    const [authorities, setAuthorities] = useState<Authority[]>([])
    const [escalationRules] = useState<EscalationRule[]>(mockEscalationRules)

    // Complaints state
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [complaintsLoading, setComplaintsLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Dialog states
    const [addDeptDialogOpen, setAddDeptDialogOpen] = useState(false)
    const [addAuthorityDialogOpen, setAddAuthorityDialogOpen] = useState(false)
    const [addRuleDialogOpen, setAddRuleDialogOpen] = useState(false)

    // Form states
    const [editingAuthId, setEditingAuthId] = useState<string | null>(null)
    const [newDept, setNewDept] = useState({ name: "", slug: "" })
    const [newAuthority, setNewAuthority] = useState({
        name: "", email: "", designation: "", department: "", level: 1, jurisdiction: ""
    })
    const [newRule, setNewRule] = useState({ department: "", fromLevel: 1, toLevel: 2, daysToEscalate: 7 })

    // Location Dialog State
    const [addLocationDialogOpen, setAddLocationDialogOpen] = useState(false)
    const [newCity, setNewCity] = useState({ name: "", pincode: "", districtId: "" })
    const [districts, setDistricts] = useState<any[]>([])

    // Fetch initial data
    useEffect(() => {
        if (status === "authenticated") {
            fetchInitialData()
        }
    }, [status])

    const fetchInitialData = async () => {
        setLoading(true)
        await Promise.all([
            fetchDepartments(),
            fetchAuthorities(),
            fetchLocations()
        ])
        setLoading(false)
    }

    const fetchDepartments = async () => {
        try {
            const response = await fetch("/api/departments")
            if (response.ok) {
                const data = await response.json()
                // API returns strictly Department objects, but UI expects Department interface with complaintCount
                // We'll map it to add placeholder count or fetch it if API supports
                const formattedDepts = data.map((d: any) => ({
                    ...d,
                    complaintCount: 0 // Placeholder until we have stats API
                }))
                setDepartments(formattedDepts)
            }
        } catch (error) {
            console.error("Failed to fetch departments:", error)
        }
    }

    const fetchAuthorities = async () => {
        try {
            const response = await fetch("/api/authorities")
            if (response.ok) {
                const data = await response.json()
                setAuthorities(data)
            }
        } catch (error) {
            console.error("Failed to fetch authorities:", error)
        }
    }

    const fetchLocations = async () => {
        try {
            const response = await fetch("/api/locations")
        } catch (error) {
            console.error("Failed to fetch locations:", error)
        }
    }

    const handleSaveAuthority = async () => {
        try {
            if (!newAuthority.name || !newAuthority.email || !newAuthority.designation || !newAuthority.department) {
                alert("Please fill all required fields")
                return
            }

            setLoading(true)
            const url = editingAuthId ? `/api/authorities/${editingAuthId}` : "/api/authorities"
            const method = editingAuthId ? "PUT" : "POST"

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newAuthority.name,
                    email: newAuthority.email,
                    designation: newAuthority.designation,
                    departmentId: newAuthority.department,
                    level: newAuthority.level,
                    jurisdiction: newAuthority.jurisdiction,
                    password: "tempPassword123"
                })
            })

            if (response.ok) {
                const data = await response.json()
                setAddAuthorityDialogOpen(false)
                alert(editingAuthId ? "Authority updated successfully!" : "Authority added successfully!")
                setEditingAuthId(null)
                // Refresh list
                window.location.reload()
            } else {
                const err = await response.json()
                alert(err.error || "Failed to save authority")
            }
        } catch (error) {
            console.error("Error saving authority:", error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const openAddAuthorityDialog = () => {
        setEditingAuthId(null)
        setNewAuthority({
            name: "", email: "", designation: "", department: "", level: 1, jurisdiction: ""
        })
        setAddAuthorityDialogOpen(true)
    }

    const handleEditAuthority = (auth: Authority) => {
        setEditingAuthId(auth.id)
        // Find department ID if missing in auth object by name (fallback)
        const deptId = auth.departmentId || departments.find(d => d.name === auth.department)?.id || ""

        setNewAuthority({
            name: auth.name,
            email: auth.email,
            designation: auth.designation,
            department: deptId,
            level: auth.level,
            jurisdiction: auth.jurisdiction
        })
        setAddAuthorityDialogOpen(true)
    }

    const handleAddLocation = async () => {
        // Since we don't have a direct "create city" API in the previous context (only seed),
        // we might need to add it. For now, I'll alert or mock it, 
        // OR assuming we create /api/locations/create
        alert("Location adding feature is coming in the next update!")
        setAddLocationDialogOpen(false)
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/login?callbackUrl=/admin")
        }
    }, [status])

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    // Fetch complaints when tab changes to complaints
    useEffect(() => {
        if (activeTab === "complaints" && complaints.length === 0) {
            fetchComplaints()
        }
    }, [activeTab])

    const fetchComplaints = async () => {
        setComplaintsLoading(true)
        try {
            const response = await fetch("/api/complaints?limit=100")
            if (response.ok) {
                const data = await response.json()
                setComplaints(data.complaints || [])
            }
        } catch (error) {
            console.error("Failed to fetch complaints:", error)
        } finally {
            setComplaintsLoading(false)
        }
    }

    const filteredComplaints = statusFilter === "all"
        ? complaints
        : complaints.filter(c => c.status === statusFilter)

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            SUBMITTED: "bg-blue-100 text-blue-700",
            VIEWED: "bg-purple-100 text-purple-700",
            IN_PROGRESS: "bg-yellow-100 text-yellow-700",
            RESOLVED: "bg-green-100 text-green-700",
            ESCALATED: "bg-orange-100 text-orange-700",
            CLOSED: "bg-slate-100 text-slate-700",
            REJECTED: "bg-red-100 text-red-700"
        }
        return colors[status] || "bg-slate-100 text-slate-700"
    }

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            LOW: "bg-slate-100 text-slate-600",
            MEDIUM: "bg-blue-100 text-blue-600",
            HIGH: "bg-orange-100 text-orange-600",
            URGENT: "bg-red-100 text-red-600"
        }
        return colors[priority] || "bg-slate-100 text-slate-600"
    }

    // Stats
    const totalComplaints = departments.reduce((sum, d) => sum + d.complaintCount, 0)
    const activeAuthorities = authorities.filter(a => a.isActive).length

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading admin panel...</p>
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
                            Admin Panel
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Manage departments, authorities, and escalation rules
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-6">
                            <TabsTrigger value="overview" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="departments" className="gap-2">
                                <Building2 className="h-4 w-4" />
                                Departments
                            </TabsTrigger>
                            <TabsTrigger value="authorities" className="gap-2">
                                <Users className="h-4 w-4" />
                                Authorities
                            </TabsTrigger>
                            <TabsTrigger value="escalation" className="gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Escalation Rules
                            </TabsTrigger>
                            <TabsTrigger value="complaints" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Complaints
                            </TabsTrigger>
                            <TabsTrigger value="locations" className="gap-2">
                                <MapPin className="h-4 w-4" />
                                Locations
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Total Complaints</p>
                                                <p className="text-3xl font-bold text-slate-900">{totalComplaints}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-indigo-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Departments</p>
                                                <p className="text-3xl font-bold text-slate-900">{departments.length}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                                <Building2 className="h-6 w-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Active Authorities</p>
                                                <p className="text-3xl font-bold text-slate-900">{activeAuthorities}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                                <Users className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="stat-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Escalation Rules</p>
                                                <p className="text-3xl font-bold text-slate-900">{escalationRules.length}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card variant="elevated">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center gap-2"
                                            onClick={() => { setActiveTab("departments"); setAddDeptDialogOpen(true) }}
                                        >
                                            <Plus className="h-6 w-6 text-indigo-600" />
                                            <span>Add Department</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center gap-2"
                                            onClick={() => { setActiveTab("authorities"); openAddAuthorityDialog() }}
                                        >
                                            <Plus className="h-6 w-6 text-green-600" />
                                            <span>Add Authority</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center gap-2"
                                            onClick={() => { setActiveTab("escalation"); setAddRuleDialogOpen(true) }}
                                        >
                                            <Plus className="h-6 w-6 text-orange-600" />
                                            <span>Add Escalation Rule</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Departments Tab */}
                        <TabsContent value="departments">
                            <Card variant="elevated">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Departments</CardTitle>
                                    <Button onClick={() => setAddDeptDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Department
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {departments.map((dept) => (
                                            <div
                                                key={dept.id}
                                                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                        <Building2 className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{dept.name}</p>
                                                        <p className="text-sm text-slate-500">{dept.complaintCount} complaints</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={dept.isActive ? "success" : "secondary"}>
                                                        {dept.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Authorities Tab */}
                        <TabsContent value="authorities">
                            <Card variant="elevated">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Authorities</CardTitle>
                                    <Button onClick={openAddAuthorityDialog}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Authority
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {authorities.map((auth) => (
                                            <div
                                                key={auth.id}
                                                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow gap-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                                                        {auth.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{auth.name}</p>
                                                        <p className="text-sm text-slate-500">{auth.designation}</p>
                                                        <p className="text-xs text-slate-400">{auth.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                                                    <Badge variant="outline">{auth.department}</Badge>
                                                    <span className="text-sm text-slate-500">Level {auth.level}</span>
                                                    <span className="text-sm text-slate-500">{auth.jurisdiction}</span>
                                                    <Badge variant={auth.isActive ? "success" : "secondary"}>
                                                        {auth.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditAuthority(auth)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Escalation Rules Tab */}
                        <TabsContent value="escalation">
                            <Card variant="elevated">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Escalation Rules</CardTitle>
                                    <Button onClick={() => setAddRuleDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Rule
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {escalationRules.map((rule) => (
                                            <div
                                                key={rule.id}
                                                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            L{rule.fromLevel}
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                            L{rule.toLevel}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{rule.department}</p>
                                                        <p className="text-sm text-slate-500">
                                                            Escalate after {rule.daysToEscalate} days
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={rule.isActive ? "success" : "secondary"}>
                                                        {rule.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Complaints Tab */}
                        <TabsContent value="complaints">
                            <Card variant="elevated">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>All Complaints</CardTitle>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {filteredComplaints.length} complaints found
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <Filter className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                                <SelectItem value="VIEWED">Viewed</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                                <SelectItem value="ESCALATED">Escalated</SelectItem>
                                                <SelectItem value="CLOSED">Closed</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" onClick={fetchComplaints}>
                                            <Search className="h-4 w-4 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {complaintsLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                        </div>
                                    ) : filteredComplaints.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                            <p className="text-slate-500">No complaints found</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-slate-200">
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Ticket #</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Title</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Status</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Priority</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Department</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Citizen</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Date</th>
                                                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredComplaints.map((complaint) => (
                                                        <tr key={complaint.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                            <td className="py-3 px-4">
                                                                <span className="font-mono text-sm text-indigo-600">
                                                                    {complaint.ticketNumber}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <p className="font-medium text-slate-900 truncate max-w-[200px]">
                                                                    {complaint.title}
                                                                </p>
                                                                <p className="text-xs text-slate-500">{complaint.city?.name}</p>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                                                    {complaint.status.replace(/_/g, ' ')}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                                                                    {complaint.priority}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-slate-600">
                                                                {complaint.department?.name}
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <p className="text-sm text-slate-900">{complaint.citizen?.name}</p>
                                                                <p className="text-xs text-slate-500">{complaint.citizen?.email}</p>
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-slate-500">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Locations Tab */}
                        <TabsContent value="locations">
                            <Card variant="elevated">
                                <CardHeader>
                                    <CardTitle>Location Management</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center py-12">
                                    <MapPin className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500 mb-4">
                                        Manage states, districts, cities, and wards for jurisdiction mapping
                                    </p>
                                    <Button onClick={() => setAddLocationDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Location
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Add Location Dialog */}
            <Dialog open={addLocationDialogOpen} onOpenChange={setAddLocationDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Location</DialogTitle>
                        <DialogDescription>Add a new City/Town to the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>City Name</Label>
                            <Input
                                placeholder="e.g. Pune City"
                                value={newCity.name}
                                onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pincode</Label>
                            <Input
                                placeholder="e.g. 411001"
                                value={newCity.pincode}
                                onChange={(e) => setNewCity({ ...newCity, pincode: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddLocationDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddLocation}>Add City</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Department Dialog */}
            <Dialog open={addDeptDialogOpen} onOpenChange={setAddDeptDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Department</DialogTitle>
                        <DialogDescription>
                            Create a new department for complaint categorization
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Department Name</Label>
                            <Input
                                placeholder="e.g., Health & Hospitals"
                                value={newDept.name}
                                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL Slug</Label>
                            <Input
                                placeholder="e.g., health-hospitals"
                                value={newDept.slug}
                                onChange={(e) => setNewDept({ ...newDept, slug: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDeptDialogOpen(false)}>Cancel</Button>
                        <Button>Add Department</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Authority Dialog */}
            <Dialog open={addAuthorityDialogOpen} onOpenChange={setAddAuthorityDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingAuthId ? "Edit Authority" : "Add Authority"}</DialogTitle>
                        <DialogDescription>
                            {editingAuthId ? "Update existing authority details" : "Add a new authority who can handle complaints"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    placeholder="Full name"
                                    value={newAuthority.name}
                                    onChange={(e) => setNewAuthority({ ...newAuthority, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={newAuthority.email}
                                    onChange={(e) => setNewAuthority({ ...newAuthority, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Designation</Label>
                            <Input
                                placeholder="e.g., Junior Engineer"
                                value={newAuthority.designation}
                                onChange={(e) => setNewAuthority({ ...newAuthority, designation: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select
                                    value={newAuthority.department}
                                    onValueChange={(v) => setNewAuthority({ ...newAuthority, department: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Level</Label>
                                <Select
                                    value={String(newAuthority.level)}
                                    onValueChange={(v) => setNewAuthority({ ...newAuthority, level: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Level 1 (Junior)</SelectItem>
                                        <SelectItem value="2">Level 2 (Senior)</SelectItem>
                                        <SelectItem value="3">Level 3 (Commissioner)</SelectItem>
                                        <SelectItem value="4">Level 4 (District)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Jurisdiction</Label>
                            <Input
                                placeholder="e.g., Ward 14, Prayagraj"
                                value={newAuthority.jurisdiction}
                                onChange={(e) => setNewAuthority({ ...newAuthority, jurisdiction: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddAuthorityDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAuthority}>
                            {editingAuthId ? "Update Authority" : "Add Authority"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Escalation Rule Dialog */}
            <Dialog open={addRuleDialogOpen} onOpenChange={setAddRuleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Escalation Rule</DialogTitle>
                        <DialogDescription>
                            Configure auto-escalation rules for departments
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select
                                value={newRule.department}
                                onValueChange={(v) => setNewRule({ ...newRule, department: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>From Level</Label>
                                <Select
                                    value={String(newRule.fromLevel)}
                                    onValueChange={(v) => setNewRule({ ...newRule, fromLevel: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Level 1</SelectItem>
                                        <SelectItem value="2">Level 2</SelectItem>
                                        <SelectItem value="3">Level 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>To Level</Label>
                                <Select
                                    value={String(newRule.toLevel)}
                                    onValueChange={(v) => setNewRule({ ...newRule, toLevel: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">Level 2</SelectItem>
                                        <SelectItem value="3">Level 3</SelectItem>
                                        <SelectItem value="4">Level 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Days to Escalate</Label>
                            <Input
                                type="number"
                                min={1}
                                value={newRule.daysToEscalate}
                                onChange={(e) => setNewRule({ ...newRule, daysToEscalate: parseInt(e.target.value) })}
                            />
                            <p className="text-xs text-slate-500">
                                Complaint will auto-escalate if not resolved within this period
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddRuleDialogOpen(false)}>Cancel</Button>
                        <Button>Add Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}
