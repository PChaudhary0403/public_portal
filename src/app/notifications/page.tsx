"use client"

import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
    const { data: session } = useSession()

    // Mock notifications for demo purposes
    const notifications = [
        {
            id: 1,
            title: "Complaint Resolved",
            message: "Your complaint regarding 'Pothole on Main Road' has been marked as resolved.",
            time: "2 hours ago",
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-50",
            read: false
        },
        {
            id: 2,
            title: "Status Update",
            message: "Authority has viewed your complaint #GRV-2024-001234.",
            time: "1 day ago",
            icon: run,
            color: "text-blue-500",
            bg: "bg-blue-50",
            read: true
        },
        {
            id: 3,
            title: "System Maintenance",
            message: "The portal will be undergoing scheduled maintenance on Sunday from 2 AM to 4 AM.",
            time: "2 days ago",
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-50",
            read: true
        }
    ]

    function run(props: any) {
        return <Clock {...props} />
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Notifications</h1>
                            <p className="text-slate-500 mt-1">Stay updated with your complaint status and system alerts</p>
                        </div>
                        <Button variant="outline" size="sm">
                            Mark all as read
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-indigo-500' : ''}`}>
                                    <CardContent className="p-4 sm:p-6 flex gap-4">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${notification.bg} flex items-center justify-center flex-shrink-0`}>
                                            <notification.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${notification.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-semibold text-slate-900 ${!notification.read ? 'text-indigo-900' : ''}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                    <Bell className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No notifications</h3>
                                <p className="text-slate-500 mt-1">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
