"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
    Search,
    FileText,
    CheckCircle2,
    Clock,
    MapPin,
    User,
    ArrowRight,
    Loader2,
    AlertCircle,
    Download
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStatusColor, formatDate } from "@/lib/utils"
import { downloadReceipt } from "@/lib/receipt-generator"

interface ComplaintDetails {
    id: string
    ticketNumber: string
    title: string
    description: string
    status: string
    priority: string
    createdAt: string
    viewedAt: string | null
    resolvedAt: string | null
    department: { name: string }
    city: { name: string }
    ward: { number: number; name: string } | null
    address: string
    assignedAuthority: {
        designation: string
        user: { name: string }
    } | null
    statusLogs: {
        id: string
        status: string
        notes: string | null
        createdAt: string
        authority: { designation: string; user: { name: string } } | null
    }[]
}

const mockComplaint: ComplaintDetails = {
    id: "1",
    ticketNumber: "GRV-M9X8Y7-ABCD",
    title: "Pothole on Main Road near Market",
    description: "There is a large pothole on Main Road near the vegetable market that has been causing accidents. Several two-wheelers have skidded due to this. The pothole is approximately 2 feet wide and 8 inches deep. This needs immediate attention.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    department: { name: "Roadways & Transport" },
    city: { name: "Prayagraj" },
    ward: { number: 14, name: "Civil Lines" },
    address: "Near Vegetable Market, Main Road, Civil Lines",
    assignedAuthority: {
        designation: "Junior Engineer, Road Department",
        user: { name: "Rajesh Kumar" }
    },
    statusLogs: [
        {
            id: "1",
            status: "SUBMITTED",
            notes: "Complaint registered successfully",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            authority: null
        },
        {
            id: "2",
            status: "VIEWED",
            notes: "Complaint reviewed and forwarded to field team",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            authority: { designation: "Junior Engineer", user: { name: "Rajesh Kumar" } }
        },
        {
            id: "3",
            status: "IN_PROGRESS",
            notes: "Field inspection completed. Work order issued for pothole repair. Expected completion in 2 days.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            authority: { designation: "Junior Engineer", user: { name: "Rajesh Kumar" } }
        }
    ]
}

function TrackComplaintContent() {
    const searchParams = useSearchParams()
    const initialTicket = searchParams.get("ticket") || ""

    const [ticketNumber, setTicketNumber] = useState(initialTicket)
    const [complaint, setComplaint] = useState<ComplaintDetails | null>(null)
    const [loading, setLoading] = useState(!!initialTicket)
    const [error, setError] = useState("")
    const [searched, setSearched] = useState(!!initialTicket)

    // Auto-fetch if there's an initial ticket number from URL
    useEffect(() => {
        if (initialTicket) {
            fetchComplaint(initialTicket)
        }
    }, [initialTicket])

    const fetchComplaint = async (ticket: string) => {
        setLoading(true)
        setError("")
        setComplaint(null)

        try {
            const response = await fetch(`/api/complaints?ticketNumber=${encodeURIComponent(ticket.trim())}`)

            if (response.ok) {
                const data = await response.json()
                const complaints = data.complaints || []
                if (complaints.length > 0) {
                    setComplaint(complaints[0])
                } else {
                    setError("No complaint found with this ticket number")
                }
            } else {
                setError("Failed to fetch complaint details")
            }
        } catch (err) {
            console.error("Error fetching complaint:", err)
            setError("An error occurred while searching. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!ticketNumber.trim()) return

        setSearched(true)
        fetchComplaint(ticketNumber)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SUBMITTED":
            case "VIEWED":
                return <Clock className="h-5 w-5" />
            case "IN_PROGRESS":
                return <Loader2 className="h-5 w-5 animate-spin" />
            case "RESOLVED":
            case "CLOSED":
                return <CheckCircle2 className="h-5 w-5" />
            default:
                return <FileText className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Track Your Complaint
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Enter your ticket number to view the current status and updates on your grievance.
                        </p>
                    </div>

                    {/* Search Form */}
                    <Card variant="elevated" className="mb-8">
                        <CardContent className="p-6">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter ticket number (e.g., GRV-M9X8Y7-ABCD)"
                                        value={ticketNumber}
                                        onChange={(e) => setTicketNumber(e.target.value)}
                                        className="pl-12 h-12 text-lg"
                                    />
                                </div>
                                <Button type="submit" size="lg" disabled={loading || !ticketNumber.trim()}>
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Track
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Error State */}
                    {error && searched && (
                        <Card className="border-red-200 bg-red-50 mb-8">
                            <CardContent className="p-6 flex items-center gap-4">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                                <div>
                                    <p className="font-medium text-red-800">{error}</p>
                                    <p className="text-sm text-red-600 mt-1">
                                        Please check the ticket number and try again.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Complaint Details */}
                    {complaint && (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <Card variant="elevated">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Ticket Number</p>
                                            <p className="text-xl font-mono font-bold text-indigo-600">
                                                {complaint.ticketNumber}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${getStatusColor(complaint.status)} text-sm px-4 py-2`}>
                                                {complaint.status.replace("_", " ")}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => {
                                                    downloadReceipt({
                                                        ticketNumber: complaint.ticketNumber,
                                                        title: complaint.title,
                                                        description: complaint.description,
                                                        department: complaint.department.name,
                                                        priority: complaint.priority,
                                                        location: `${complaint.ward ? `Ward ${complaint.ward.number}, ` : ''}${complaint.city.name}`,
                                                        address: complaint.address || '',
                                                        submittedAt: new Date(complaint.createdAt)
                                                    })
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                                Receipt
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                        {complaint.title}
                                    </h2>
                                    <p className="text-slate-600 mb-4">{complaint.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-100 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Department</p>
                                                <p className="font-medium text-slate-900">{complaint.department.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Location</p>
                                                <p className="font-medium text-slate-900">
                                                    {complaint.ward && `Ward ${complaint.ward.number}, `}
                                                    {complaint.city.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Filed On</p>
                                                <p className="font-medium text-slate-900">{formatDate(complaint.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <User className="h-5 w-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-slate-500">Assigned To</p>
                                                <p className="font-medium text-slate-900">
                                                    {complaint.assignedAuthority?.user.name || "Pending Assignment"}
                                                </p>
                                                {complaint.assignedAuthority && (
                                                    <p className="text-xs text-slate-500">
                                                        {complaint.assignedAuthority.designation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card variant="elevated">
                                <CardHeader>
                                    <CardTitle>Status Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        {complaint.statusLogs.slice().reverse().map((log, index, arr) => (
                                            <div key={log.id} className="flex gap-4 pb-6 last:pb-0">
                                                {/* Line */}
                                                <div className="relative flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0
                                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                                        : 'bg-green-100 text-green-600'
                                                        }`}>
                                                        {getStatusIcon(log.status)}
                                                    </div>
                                                    {index < arr.length - 1 && (
                                                        <div className="w-0.5 flex-1 bg-gradient-to-b from-indigo-500 to-green-500 mt-2" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 pb-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                                        <span className="font-semibold text-slate-900">
                                                            {log.status.replace("_", " ")}
                                                        </span>
                                                        <span className="text-sm text-slate-500">
                                                            {formatDate(log.createdAt)}
                                                        </span>
                                                    </div>
                                                    {log.notes && (
                                                        <p className="text-slate-600 text-sm">{log.notes}</p>
                                                    )}
                                                    {log.authority && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            By {log.authority.user.name} ({log.authority.designation})
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {complaint.status === "RESOLVED" && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                                                <div>
                                                    <p className="font-semibold text-green-800">Complaint Resolved!</p>
                                                    <p className="text-sm text-green-600">
                                                        Please confirm if you are satisfied with the resolution.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                                                    Not Satisfied
                                                </Button>
                                                <Button className="bg-green-600 hover:bg-green-700">
                                                    Confirm & Rate
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* No Search Yet */}
                    {!searched && !complaint && (
                        <Card className="text-center">
                            <CardContent className="py-12">
                                <Search className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 mb-4">
                                    Enter your ticket number above to track your complaint
                                </p>
                                <p className="text-sm text-slate-400">
                                    Don&apos;t have a ticket number?{" "}
                                    <Link href="/auth/login" className="text-indigo-600 hover:underline">
                                        Sign in
                                    </Link>
                                    {" "}to view all your complaints.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function TrackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <TrackComplaintContent />
        </Suspense>
    )
}
