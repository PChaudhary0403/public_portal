import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateTicketNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `GRV-${timestamp}-${random}`
}

export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        VIEWED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        ESCALATED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return colors[status] || colors.SUBMITTED
}

export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        LOW: 'bg-gray-100 text-gray-800',
        MEDIUM: 'bg-blue-100 text-blue-800',
        HIGH: 'bg-orange-100 text-orange-800',
        URGENT: 'bg-red-100 text-red-800',
    }
    return colors[priority] || colors.MEDIUM
}

export function calculateDaysAgo(date: Date | string): string {
    const now = new Date()
    const then = new Date(date)
    const diffInMs = now.getTime() - then.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
}
