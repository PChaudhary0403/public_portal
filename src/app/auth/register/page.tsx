"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Registration failed")
            } else {
                router.push("/auth/login?registered=true")
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const passwordRequirements = [
        { label: "At least 6 characters", met: formData.password.length >= 6 },
        { label: "Passwords match", met: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 },
    ]

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                {/* Floating shapes */}
                <div className="absolute top-32 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
                <div className="absolute bottom-32 left-10 w-56 h-56 bg-indigo-500/20 rounded-full blur-2xl" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white">JanSeva</span>
                            <span className="text-sm block text-indigo-200">Public Grievance Portal</span>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Join the Movement
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-md mb-8">
                        Register as a citizen to file grievances and hold authorities accountable for public services.
                    </p>

                    <div className="space-y-4">
                        {[
                            "File and track complaints easily",
                            "Get real-time status updates",
                            "View authority performance metrics",
                            "Secure and transparent process"
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-indigo-100">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-sm text-indigo-200">
                    © {new Date().getFullYear()} JanSeva Portal. All rights reserved.
                </div>
            </div>

            {/* Right side - Registration form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center space-x-2">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-bold text-slate-900">JanSeva</span>
                                <span className="text-sm block text-slate-500">Public Grievance Portal</span>
                            </div>
                        </Link>
                    </div>

                    <Card variant="elevated">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Create Account</CardTitle>
                            <CardDescription>
                                Register to start filing and tracking grievances
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pl-10"
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pl-10 pr-10"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                {/* Password requirements */}
                                <div className="p-3 bg-slate-100 rounded-lg">
                                    <p className="text-xs font-medium text-slate-700 mb-2">Password Requirements</p>
                                    <div className="space-y-1">
                                        {passwordRequirements.map((req, idx) => (
                                            <div key={idx} className="flex items-center space-x-2 text-xs">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-slate-300'}`}>
                                                    {req.met && <CheckCircle className="h-3 w-3 text-white" />}
                                                </div>
                                                <span className={req.met ? 'text-green-600' : 'text-slate-500'}>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Creating account...
                                        </div>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-slate-500 text-center">
                                    By registering, you agree to our{" "}
                                    <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                                </p>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
