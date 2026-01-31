"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
    ArrowLeft,
    ArrowRight,
    Upload,
    MapPin,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader2,
    X,
    Heart,
    Car,
    Droplets,
    Zap,
    Wheat,
    GraduationCap,
    Shield,
    Building2,
    Eye,
    Download
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { downloadReceipt } from "@/lib/receipt-generator"

interface Department {
    id: string
    name: string
    slug: string
}

interface LocationOption {
    id: string
    name: string
    number?: number
}

const departmentIcons: Record<string, React.ElementType> = {
    'health-hospitals': Heart,
    'roadways-transport': Car,
    'water-supply': Droplets,
    'electricity': Zap,
    'food-distribution': Wheat,
    'education': GraduationCap,
    'police-safety': Shield,
    'municipal-services': Building2,
    'corruption-vigilance': Eye
}

function FileComplaintContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState<{
        ticketNumber: string
        submittedAt: Date
    } | null>(null)

    // Form data
    const [formData, setFormData] = useState({
        departmentId: "",
        departmentSlug: "",
        title: "",
        description: "",
        priority: "MEDIUM",
        stateId: "",
        districtId: "",
        cityId: "",
        wardId: "",
        pincode: "",
        address: "",
    })

    // Location options
    const [states, setStates] = useState<LocationOption[]>([])
    const [districts, setDistricts] = useState<LocationOption[]>([])
    const [cities, setCities] = useState<LocationOption[]>([])
    const [wards, setWards] = useState<LocationOption[]>([])

    // File uploads
    const [files, setFiles] = useState<File[]>([])

    // Departments
    const [departments, setDepartments] = useState<Department[]>([])

    // Fetch departments from API
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("/api/departments")
                if (response.ok) {
                    const data = await response.json()
                    setDepartments(data)
                }
            } catch (error) {
                console.error("Failed to fetch departments:", error)
            }
        }
        fetchDepartments()
    }, [])

    // Check for pre-selected department
    useEffect(() => {
        const deptSlug = searchParams.get("department")
        if (deptSlug && departments.length > 0) {
            const dept = departments.find(d => d.slug === deptSlug)
            if (dept) {
                setFormData(prev => ({ ...prev, departmentId: dept.id, departmentSlug: dept.slug }))
                setStep(2)
            }
        }
    }, [searchParams, departments])

    // Fetch states from API
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch("/api/locations")
                if (response.ok) {
                    const data = await response.json()
                    setStates(data.states || [])
                }
            } catch (error) {
                console.error("Failed to fetch states:", error)
            }
        }
        fetchStates()
    }, [])

    // Fetch districts when state changes
    useEffect(() => {
        if (formData.stateId) {
            setLoading(true)
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(`/api/locations?stateId=${formData.stateId}`)
                    if (response.ok) {
                        const data = await response.json()
                        setDistricts(data.districts || [])
                    }
                } catch (error) {
                    console.error("Failed to fetch districts:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchDistricts()
            setFormData(prev => ({ ...prev, districtId: "", cityId: "", wardId: "" }))
            setCities([])
            setWards([])
        }
    }, [formData.stateId])

    // Fetch cities when district changes
    useEffect(() => {
        if (formData.districtId) {
            setLoading(true)
            const fetchCities = async () => {
                try {
                    const response = await fetch(`/api/locations?districtId=${formData.districtId}`)
                    if (response.ok) {
                        const data = await response.json()
                        setCities(data.cities || [])
                    }
                } catch (error) {
                    console.error("Failed to fetch cities:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchCities()
            setFormData(prev => ({ ...prev, cityId: "", wardId: "" }))
            setWards([])
        }
    }, [formData.districtId])

    // Fetch wards when city changes
    useEffect(() => {
        if (formData.cityId) {
            setLoading(true)
            const fetchWards = async () => {
                try {
                    const response = await fetch(`/api/locations?cityId=${formData.cityId}`)
                    if (response.ok) {
                        const data = await response.json()
                        setWards(data.wards || [])
                    }
                } catch (error) {
                    console.error("Failed to fetch wards:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchWards()
            setFormData(prev => ({ ...prev, wardId: "" }))
        }
    }, [formData.cityId])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles(prev => [...prev, ...newFiles].slice(0, 5)) // Max 5 files
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (status !== "authenticated") {
            router.push("/auth/login?callbackUrl=/file-complaint")
            return
        }

        setSubmitting(true)
        setError("")

        try {
            // In a real app, you'd upload files first and get URLs
            const response = await fetch("/api/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    departmentId: formData.departmentId,
                    cityId: formData.cityId,
                    wardId: formData.wardId || null,
                    address: formData.address,
                    pincode: formData.pincode,
                    priority: formData.priority,
                    evidenceUrls: [], // Would contain uploaded file URLs
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to submit complaint")
            } else {
                setSuccess({
                    ticketNumber: data.complaint.ticketNumber,
                    submittedAt: new Date()
                })
                setStep(5)
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const selectDepartment = (dept: Department) => {
        setFormData(prev => ({ ...prev, departmentId: dept.id, departmentSlug: dept.slug }))
        setStep(2)
    }

    const stepTitles = [
        "Select Department",
        "Location Details",
        "Complaint Details",
        "Review & Submit",
        "Success"
    ]

    const selectedDepartment = departments.find(d => d.id === formData.departmentId)
    const DeptIcon = selectedDepartment ? departmentIcons[selectedDepartment.slug] : FileText

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">File a Complaint</h1>
                            <span className="text-sm text-slate-500">Step {step} of 4</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{stepTitles[step - 1]}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-600">{error}</div>
                        </div>
                    )}

                    {/* Step 1: Department Selection */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {departments.map((dept) => {
                                const Icon = departmentIcons[dept.slug] || FileText
                                return (
                                    <Card
                                        key={dept.id}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${formData.departmentId === dept.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                                            }`}
                                        onClick={() => selectDepartment(dept)}
                                    >
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="font-medium text-slate-900">{dept.name}</div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}

                    {/* Step 2: Location Details */}
                    {step === 2 && (
                        <Card variant="elevated">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle>Location Details</CardTitle>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Provide the location where the issue occurred
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Select
                                            value={formData.stateId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, stateId: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {states.map((state) => (
                                                    <SelectItem key={state.id} value={state.id}>
                                                        {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>District</Label>
                                        <Select
                                            value={formData.districtId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, districtId: value }))}
                                            disabled={!formData.stateId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select district" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((district) => (
                                                    <SelectItem key={district.id} value={district.id}>
                                                        {district.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>City/Town</Label>
                                        <Select
                                            value={formData.cityId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, cityId: value }))}
                                            disabled={!formData.districtId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities.map((city) => (
                                                    <SelectItem key={city.id} value={city.id}>
                                                        {city.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ward (Optional)</Label>
                                        <Select
                                            value={formData.wardId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, wardId: value }))}
                                            disabled={!formData.cityId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ward" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {wards.map((ward) => (
                                                    <SelectItem key={ward.id} value={ward.id}>
                                                        Ward {ward.number} {ward.name && `- ${ward.name}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Pincode</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter pincode"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                                        maxLength={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Address / Landmark</Label>
                                    <Textarea
                                        placeholder="Provide a specific address or nearby landmark"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button onClick={() => setStep(3)} disabled={!formData.cityId}>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Complaint Details */}
                    {step === 3 && (
                        <Card variant="elevated">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle>Complaint Details</CardTitle>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Describe your grievance in detail
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Complaint Title *</Label>
                                    <Input
                                        type="text"
                                        placeholder="Brief title for your complaint"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description *</Label>
                                    <Textarea
                                        placeholder="Provide detailed description of the issue, including when it started, how it affects you, and any other relevant information"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="min-h-[150px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Evidence (Optional)</Label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors">
                                        <input
                                            type="file"
                                            id="evidence"
                                            multiple
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="evidence" className="cursor-pointer">
                                            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-600">
                                                Click to upload images or PDFs
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Max 5 files, 10MB each
                                            </p>
                                        </label>
                                    </div>
                                    {files.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                                                    <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
                                                    <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={() => setStep(2)}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button onClick={() => setStep(4)} disabled={!formData.title || !formData.description}>
                                        Review
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <Card variant="elevated">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle>Review Your Complaint</CardTitle>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Please verify all details before submitting
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Department */}
                                <div className="p-4 bg-indigo-50 rounded-xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <DeptIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-indigo-600">Department</p>
                                        <p className="font-semibold text-slate-900">{selectedDepartment?.name}</p>
                                    </div>
                                </div>

                                {/* Complaint Details */}
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-slate-500">Title</p>
                                        <p className="font-medium text-slate-900">{formData.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Description</p>
                                        <p className="text-slate-700">{formData.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500">Priority</p>
                                            <p className="font-medium text-slate-900">{formData.priority}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Evidence</p>
                                            <p className="font-medium text-slate-900">{files.length} file(s)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="p-4 bg-slate-100 rounded-xl">
                                    <p className="text-sm text-slate-500 mb-2">Location</p>
                                    <p className="text-slate-900">
                                        {formData.address && `${formData.address}, `}
                                        {formData.wardId && `Ward ${wards.find(w => w.id === formData.wardId)?.number}, `}
                                        {cities.find(c => c.id === formData.cityId)?.name}
                                        {formData.pincode && ` - ${formData.pincode}`}
                                    </p>
                                </div>

                                {/* Auth check */}
                                {status !== "authenticated" && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                        <div className="flex-1">
                                            <p className="text-sm text-yellow-800">
                                                You need to sign in to submit your complaint.
                                            </p>
                                        </div>
                                        <Link href="/auth/login?callbackUrl=/file-complaint">
                                            <Button size="sm">Sign In</Button>
                                        </Link>
                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={() => setStep(3)}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Submit Complaint
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && success && (
                        <Card variant="elevated" className="text-center">
                            <CardContent className="py-12">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    Complaint Submitted Successfully!
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    Your complaint has been registered and assigned to the relevant authority.
                                </p>

                                <div className="inline-block p-4 bg-indigo-50 rounded-xl mb-8">
                                    <p className="text-sm text-indigo-600">Ticket Number</p>
                                    <p className="text-2xl font-mono font-bold text-indigo-900">
                                        {success.ticketNumber}
                                    </p>
                                </div>

                                <p className="text-sm text-slate-500 mb-6">
                                    Save this ticket number to track your complaint status
                                </p>

                                {/* Download Receipt Button */}
                                <div className="mb-6">
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
                                        onClick={() => {
                                            const selectedCity = cities.find(c => c.id === formData.cityId)
                                            const selectedWard = wards.find(w => w.id === formData.wardId)

                                            downloadReceipt({
                                                ticketNumber: success.ticketNumber,
                                                title: formData.title,
                                                description: formData.description,
                                                department: selectedDepartment?.name || 'Unknown',
                                                priority: formData.priority,
                                                location: `${selectedWard ? `Ward ${selectedWard.number}, ` : ''}${selectedCity?.name || ''}`,
                                                address: formData.address,
                                                pincode: formData.pincode,
                                                submittedAt: success.submittedAt,
                                                citizenName: session?.user?.name || undefined,
                                                citizenEmail: session?.user?.email || undefined
                                            })
                                        }}
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Receipt
                                    </Button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href={`/track?ticket=${success.ticketNumber}`}>
                                        <Button>Track Complaint</Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button variant="outline">Go to Dashboard</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function FileComplaintPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <FileComplaintContent />
        </Suspense>
    )
}
