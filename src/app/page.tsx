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
  FileText,
  Search,
  CheckCircle2,
  TrendingUp,
  Clock,
  Users
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const departments = [
  {
    id: "health",
    name: "Health & Hospitals",
    slug: "health-hospitals",
    description: "Healthcare services, hospitals, and medical facilities",
    icon: Heart,
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50",
    textColor: "text-red-600"
  },
  {
    id: "roadways",
    name: "Roadways & Transport",
    slug: "roadways-transport",
    description: "Roads, highways, public transport, and traffic",
    icon: Car,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600"
  },
  {
    id: "water",
    name: "Water Supply & Drainage",
    slug: "water-supply",
    description: "Water supply, drainage, and sewage systems",
    icon: Droplets,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    id: "electricity",
    name: "Electricity",
    slug: "electricity",
    description: "Power supply, electrical infrastructure",
    icon: Zap,
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600"
  },
  {
    id: "food",
    name: "Food & Distribution",
    slug: "food-distribution",
    description: "Ration shops, food quality, PDS system",
    icon: Wheat,
    color: "from-lime-500 to-green-600",
    bgColor: "bg-lime-50",
    textColor: "text-lime-600"
  },
  {
    id: "education",
    name: "Education",
    slug: "education",
    description: "Schools, colleges, and educational institutions",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    textColor: "text-violet-600"
  },
  {
    id: "police",
    name: "Police & Safety",
    slug: "police-safety",
    description: "Law enforcement, public safety, emergencies",
    icon: Shield,
    color: "from-blue-600 to-indigo-700",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600"
  },
  {
    id: "municipal",
    name: "Municipal Services",
    slug: "municipal-services",
    description: "Sanitation, waste management, civic amenities",
    icon: Building2,
    color: "from-teal-500 to-emerald-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600"
  },
  {
    id: "vigilance",
    name: "Corruption & Vigilance",
    slug: "corruption-vigilance",
    description: "Anti-corruption complaints and vigilance",
    icon: Eye,
    color: "from-red-600 to-rose-700",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600"
  }
]

const stats = [
  { label: "Complaints Filed", value: "50,000+", icon: FileText },
  { label: "Issues Resolved", value: "45,000+", icon: CheckCircle2 },
  { label: "Avg. Resolution Time", value: "7 Days", icon: Clock },
  { label: "Registered Users", value: "1 Lakh+", icon: Users }
]

const howItWorks = [
  {
    step: 1,
    title: "Select Department",
    description: "Choose the relevant government department for your grievance"
  },
  {
    step: 2,
    title: "File Complaint",
    description: "Provide details, location, and upload supporting evidence"
  },
  {
    step: 3,
    title: "Track Progress",
    description: "Monitor your complaint status with real-time updates"
  },
  {
    step: 4,
    title: "Get Resolution",
    description: "Receive updates when your issue is resolved by authorities"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Serving Citizens Since 2020
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Voice <span className="text-yellow-300">Matters</span>
              <br />
              Make it <span className="relative">
                Heard
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 150 4 198 10" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              A transparent platform for citizens to register grievances, track progress, and hold public authorities accountable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/file-complaint">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl shadow-black/20 w-full sm:w-auto">
                  <FileText className="mr-2 h-5 w-5" />
                  File a Complaint
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Track Your Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L48 45.7C96 41.3 192 32.7 288 37.2C384 41.7 480 59.3 576 62.5C672 65.7 768 54.3 864 45.8C960 37.3 1056 31.7 1152 35.8C1248 40 1344 54 1392 61L1440 68V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-20 relative z-20">
            {stats.map((stat) => (
              <Card key={stat.label} variant="elevated" className="stat-card">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-indigo-600" />
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-slate-50 hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Select a <span className="gradient-text">Department</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the relevant department to file your grievance. Each department has dedicated authorities to handle your complaints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon
              return (
                <Link href={`/file-complaint?department=${dept.slug}`} key={dept.id}>
                  <Card className="department-card cursor-pointer hover:shadow-2xl transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`department-icon w-14 h-14 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center shadow-lg transition-transform duration-300`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {dept.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {dept.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Register your complaint in four simple steps and track its progress until resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                )}

                <div className="text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transparent & <span className="text-indigo-400">Accountable</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Our platform ensures complete transparency in the grievance resolution process. Track every step, from submission to resolution.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: "Real-time status updates" },
                  { icon: TrendingUp, text: "Auto-escalation for delayed responses" },
                  { icon: Users, text: "Authority performance metrics" },
                  { icon: Shield, text: "Evidence-based tracking" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-slate-200">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/register" className="inline-block mt-8">
                <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 p-8">
                {/* Mock complaint card */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      #GRV-2024-001234
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                      In Progress
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold">Pothole on Main Road</h3>
                  <p className="text-slate-400 text-sm">
                    Large pothole causing accidents near the market area. Needs immediate attention.
                  </p>

                  <div className="pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Status Timeline</div>
                    <div className="space-y-3">
                      {[
                        { status: "Submitted", date: "Jan 20", done: true },
                        { status: "Viewed by Authority", date: "Jan 21", done: true },
                        { status: "Work in Progress", date: "Jan 23", done: true },
                        { status: "Resolution Expected", date: "Jan 27", done: false }
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${step.done ? 'bg-green-500' : 'bg-slate-600 animate-pulse'}`} />
                          <div className="flex-1 flex justify-between">
                            <span className={step.done ? 'text-slate-200' : 'text-slate-500'}>{step.status}</span>
                            <span className="text-slate-500 text-sm">{step.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl shadow-indigo-500/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have a grievance? We&apos;re here to help.
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Register your complaint now and get it resolved by the responsible authorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/file-complaint">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto">
                  File a Complaint
                </Button>
              </Link>
              <Link href="/departments">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Browse Departments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
