"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    FileText,
    Shield,
    Home,
    Bell,
    Trophy,
    Vote,
    Building2,
    Flag,
    MapPin,
    ChevronDown
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getDashboardLink = () => {
        if (!session?.user?.role) return "/dashboard"
        switch (session.user.role) {
            case "ADMIN":
                return "/admin"
            case "AUTHORITY":
                return "/authority"
            default:
                return "/dashboard"
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all duration-200">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    JanSeva
                                </span>
                                <span className="text-xs block text-slate-500">Public Grievance Portal</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/">
                            <Button variant="ghost" className="gap-2">
                                <Home className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                        <Link href="/departments">
                            <Button variant="ghost" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Departments
                            </Button>
                        </Link>
                        <Link href="/track">
                            <Button variant="ghost" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Track Complaint
                            </Button>
                        </Link>
                        <Link href="/leaderboard">
                            <Button variant="ghost" className="gap-2">
                                <Trophy className="h-4 w-4" />
                                Leaderboard
                            </Button>
                        </Link>

                        {/* Political Accountability Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Report Cards
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>Political Accountability</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/constituencies">
                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                        <Vote className="h-4 w-4" />
                                        Constituencies
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/politicians">
                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                        <User className="h-4 w-4" />
                                        Elected Representatives
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/parties">
                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                        <Flag className="h-4 w-4" />
                                        Political Parties
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {status === "loading" ? (
                            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                        ) : session ? (
                            <>
                                <Link href="/notifications">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                            3
                                        </span>
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                                <p className="text-xs leading-none text-slate-500">
                                                    {session.user?.email}
                                                </p>
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 w-fit">
                                                    {session.user?.role}
                                                </span>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <Link href={getDashboardLink()}>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/profile">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600"
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/auth/login">
                                    <Button variant="ghost">Sign in</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col space-y-2">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <Home className="h-4 w-4" />
                                    Home
                                </Button>
                            </Link>
                            <Link href="/departments" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Departments
                                </Button>
                            </Link>
                            <Link href="/track" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <FileText className="h-4 w-4" />
                                    Track Complaint
                                </Button>
                            </Link>
                            <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <Trophy className="h-4 w-4" />
                                    Leaderboard
                                </Button>
                            </Link>

                            {/* Report Cards Section */}
                            <div className="pt-2 border-t border-slate-100">
                                <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Report Cards
                                </p>
                                <Link href="/constituencies" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <Vote className="h-4 w-4" />
                                        Constituencies
                                    </Button>
                                </Link>
                                <Link href="/politicians" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <User className="h-4 w-4" />
                                        Elected Representatives
                                    </Button>
                                </Link>
                                <Link href="/parties" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <Flag className="h-4 w-4" />
                                        Political Parties
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
