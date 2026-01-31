"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    Loader2,
    Edit,
    Save,
    X
} from "lucide-react"

interface UserProfile {
    id: string
    name: string
    email: string
    phone?: string
    role: 'CITIZEN' | 'AUTHORITY' | 'ADMIN'
    createdAt: string
    emailVerified?: string
    authority?: {
        id: string
        designation: string
        level: number
        department: {
            name: string
        }
        jurisdiction?: string
        avgRating?: number
        totalRatings?: number
    }
}

interface ComplaintStats {
    total: number
    pending: number
    inProgress: number
    resolved: number
    escalated: number
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ComplaintStats>({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        escalated: 0
    })
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/login?callbackUrl=/profile")
        }
        if (status === "authenticated") {
            fetchProfile()
            fetchStats()
        }
    }, [status])

    const fetchProfile = async () => {
        try {
            const response = await fetch("/api/user/profile")
            if (response.ok) {
                const data = await response.json()
                setProfile(data)
                setFormData({
                    name: data.name || '',
                    phone: data.phone || ''
                })
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/complaints")
            if (response.ok) {
                const data = await response.json()
                const complaints = data.complaints || []
                setStats({
                    total: complaints.length,
                    pending: complaints.filter((c: { status: string }) =>
                        c.status === "SUBMITTED" || c.status === "VIEWED"
                    ).length,
                    inProgress: complaints.filter((c: { status: string }) =>
                        c.status === "IN_PROGRESS"
                    ).length,
                    resolved: complaints.filter((c: { status: string }) =>
                        c.status === "RESOLVED" || c.status === "CLOSED"
                    ).length,
                    escalated: complaints.filter((c: { status: string }) =>
                        c.status === "ESCALATED"
                    ).length
                })
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                const data = await response.json()
                setProfile(data)
                setEditing(false)
            }
        } catch (error) {
            console.error("Failed to update profile:", error)
        } finally {
            setSaving(false)
        }
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 text-purple-700'
            case 'AUTHORITY': return 'bg-blue-100 text-blue-700'
            default: return 'bg-green-100 text-green-700'
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Profile Header */}
                    <Card className="mb-8 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />
                        <CardContent className="relative pt-0 pb-6">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                    <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        {getInitials(profile?.name || session?.user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {profile?.name || session?.user?.name}
                                    </h1>
                                    <p className="text-slate-500">{profile?.email || session?.user?.email}</p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                        <Badge className={getRoleBadgeColor(profile?.role || session?.user?.role || 'CITIZEN')}>
                                            <Shield className="h-3 w-3 mr-1" />
                                            {profile?.role || session?.user?.role}
                                        </Badge>
                                        {profile?.createdAt && (
                                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Member since {formatDate(profile.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {!editing && (
                                    <Button variant="outline" onClick={() => setEditing(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profile Details */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        {editing ? "Update your personal information" : "Your personal information"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {editing ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    value={profile?.email || ''}
                                                    disabled
                                                    className="bg-slate-50"
                                                />
                                                <p className="text-xs text-slate-500">Email cannot be changed</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <Button onClick={handleSave} disabled={saving}>
                                                    {saving ? (
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Save className="h-4 w-4 mr-2" />
                                                    )}
                                                    Save Changes
                                                </Button>
                                                <Button variant="outline" onClick={() => setEditing(false)}>
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <User className="h-5 w-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Full Name</p>
                                                    <p className="font-medium text-slate-900">{profile?.name || 'Not set'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Mail className="h-5 w-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Email Address</p>
                                                    <p className="font-medium text-slate-900">{profile?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Phone className="h-5 w-5 text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Phone Number</p>
                                                    <p className="font-medium text-slate-900">{profile?.phone || 'Not set'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Authority Details */}
                            {profile?.authority && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Authority Details</CardTitle>
                                        <CardDescription>Your official designation and jurisdiction</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <p className="text-xs text-slate-500">Designation</p>
                                                <p className="font-medium text-slate-900">{profile.authority.designation}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <p className="text-xs text-slate-500">Department</p>
                                                <p className="font-medium text-slate-900">{profile.authority.department.name}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <p className="text-xs text-slate-500">Level</p>
                                                <p className="font-medium text-slate-900">Level {profile.authority.level}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                <p className="text-xs text-slate-500">Jurisdiction</p>
                                                <p className="font-medium text-slate-900">{profile.authority.jurisdiction || 'Not assigned'}</p>
                                            </div>
                                            {profile.authority.avgRating !== undefined && (
                                                <div className="p-3 bg-yellow-50 rounded-lg md:col-span-2">
                                                    <p className="text-xs text-yellow-600">Average Rating</p>
                                                    <p className="font-bold text-yellow-700 text-lg">
                                                        ⭐ {profile.authority.avgRating.toFixed(1)} / 5
                                                        <span className="text-sm font-normal ml-2">
                                                            ({profile.authority.totalRatings} ratings)
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Stats Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Complaint Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                                        <span className="flex items-center gap-2 text-sm text-slate-600">
                                            <FileText className="h-4 w-4" />
                                            Total
                                        </span>
                                        <span className="font-semibold text-slate-900">{stats.total}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                                        <span className="flex items-center gap-2 text-sm text-blue-600">
                                            <Clock className="h-4 w-4" />
                                            Pending
                                        </span>
                                        <span className="font-semibold text-blue-600">{stats.pending}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                                        <span className="flex items-center gap-2 text-sm text-yellow-600">
                                            <Clock className="h-4 w-4" />
                                            In Progress
                                        </span>
                                        <span className="font-semibold text-yellow-600">{stats.inProgress}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                                        <span className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            Resolved
                                        </span>
                                        <span className="font-semibold text-green-600">{stats.resolved}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                                        <span className="flex items-center gap-2 text-sm text-orange-600">
                                            <AlertTriangle className="h-4 w-4" />
                                            Escalated
                                        </span>
                                        <span className="font-semibold text-orange-600">{stats.escalated}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href="/file-complaint">
                                        <Button variant="outline" className="w-full justify-start">
                                            <FileText className="h-4 w-4 mr-2" />
                                            File Complaint
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button variant="outline" className="w-full justify-start">
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Complaints
                                        </Button>
                                    </Link>
                                    <Link href="/track">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Track Complaint
                                        </Button>
                                    </Link>
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
