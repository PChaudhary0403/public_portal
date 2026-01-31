import Link from "next/link"
import {
    Heart,
    Car,
    Droplets,
    Zap,
    Wheat,
    GraduationCap,
    Shield,
    Building2,
    Eye,
    ArrowRight,
    FileText
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const departments = [
    {
        id: "health-hospitals",
        name: "Health & Hospitals",
        description: "Report issues related to government hospitals, healthcare centers, medical services, ambulance services, and public health concerns.",
        icon: Heart,
        color: "from-red-500 to-rose-600",
        bgColor: "bg-red-50",
        stats: { complaints: 1250, resolved: 1100, avgDays: 5 }
    },
    {
        id: "roadways-transport",
        name: "Roadways & Transport",
        description: "Report potholes, damaged roads, traffic signal issues, public transport problems, and highway maintenance concerns.",
        icon: Car,
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-50",
        stats: { complaints: 3200, resolved: 2800, avgDays: 7 }
    },
    {
        id: "water-supply",
        name: "Water Supply & Drainage",
        description: "Report water supply issues, pipeline leakages, contaminated water, drainage blockages, and sewage problems.",
        icon: Droplets,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-50",
        stats: { complaints: 890, resolved: 750, avgDays: 4 }
    },
    {
        id: "electricity",
        name: "Electricity",
        description: "Report power outages, faulty transformers, damaged electric poles, billing issues, and electrical hazards.",
        icon: Zap,
        color: "from-yellow-500 to-amber-600",
        bgColor: "bg-yellow-50",
        stats: { complaints: 2100, resolved: 1950, avgDays: 3 }
    },
    {
        id: "food-distribution",
        name: "Food & Public Distribution",
        description: "Report issues with ration shops, food quality, PDS corruption, Aadhar linking problems, and subsidy issues.",
        icon: Wheat,
        color: "from-lime-500 to-green-600",
        bgColor: "bg-lime-50",
        stats: { complaints: 450, resolved: 380, avgDays: 8 }
    },
    {
        id: "education",
        name: "Education",
        description: "Report issues in government schools and colleges, teacher absenteeism, infrastructure problems, and scholarship concerns.",
        icon: GraduationCap,
        color: "from-violet-500 to-purple-600",
        bgColor: "bg-violet-50",
        stats: { complaints: 680, resolved: 550, avgDays: 10 }
    },
    {
        id: "police-safety",
        name: "Police & Safety",
        description: "Report non-emergency safety concerns, police response issues, traffic enforcement, and community policing matters.",
        icon: Shield,
        color: "from-blue-600 to-indigo-700",
        bgColor: "bg-indigo-50",
        stats: { complaints: 1560, resolved: 1300, avgDays: 6 }
    },
    {
        id: "municipal-services",
        name: "Municipal Services",
        description: "Report garbage collection issues, street cleaning, public toilet maintenance, park upkeep, and civic amenity problems.",
        icon: Building2,
        color: "from-teal-500 to-emerald-600",
        bgColor: "bg-teal-50",
        stats: { complaints: 1750, resolved: 1500, avgDays: 5 }
    },
    {
        id: "corruption-vigilance",
        name: "Corruption & Vigilance",
        description: "Report bribery demands, abuse of power, nepotism, tender irregularities, and other corruption-related complaints.",
        icon: Eye,
        color: "from-red-600 to-rose-700",
        bgColor: "bg-rose-50",
        stats: { complaints: 320, resolved: 180, avgDays: 15 }
    }
]

export default function DepartmentsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Government <span className="gradient-text">Departments</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Select a department to file your grievance. Each department has dedicated officers
                            to handle complaints within their jurisdiction.
                        </p>
                    </div>

                    {/* Departments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept) => {
                            const Icon = dept.icon
                            return (
                                <Card key={dept.id} variant="elevated" className="group hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-7 w-7 text-white" />
                                            </div>
                                            <div className={`${dept.bgColor} px-3 py-1 rounded-full`}>
                                                <span className="text-xs font-medium text-slate-700">
                                                    {dept.stats.complaints} complaints
                                                </span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl mt-4 group-hover:text-indigo-600 transition-colors">
                                            {dept.name}
                                        </CardTitle>
                                        <CardDescription className="text-slate-500">
                                            {dept.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-100 rounded-xl">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-slate-900">{dept.stats.complaints}</p>
                                                <p className="text-xs text-slate-500">Total</p>
                                            </div>
                                            <div className="text-center border-x border-slate-200">
                                                <p className="text-lg font-bold text-green-600">{dept.stats.resolved}</p>
                                                <p className="text-xs text-slate-500">Resolved</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-indigo-600">{dept.stats.avgDays}d</p>
                                                <p className="text-xs text-slate-500">Avg Time</p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link href={`/file-complaint?department=${dept.id}`}>
                                            <Button className="w-full group-hover:bg-indigo-700">
                                                <FileText className="mr-2 h-4 w-4" />
                                                File Complaint
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Info Section */}
                    <div className="mt-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Can&apos;t find your department?</h3>
                                    <p className="text-sm text-slate-600">
                                        Contact us and we&apos;ll help route your complaint to the right authority.
                                    </p>
                                </div>
                            </div>
                            <Link href="/contact">
                                <Button variant="outline">Contact Support</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
