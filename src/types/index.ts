export interface DepartmentInfo {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string
    color: string
}

export interface LocationData {
    stateId?: string
    districtId?: string
    cityId?: string
    wardId?: string
    pincode?: string
}

export interface ComplaintFormData {
    title: string
    description: string
    departmentId: string
    cityId: string
    wardId?: string
    address?: string
    pincode?: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    evidenceUrls?: string[]
}

export interface ComplaintWithDetails {
    id: string
    ticketNumber: string
    title: string
    description: string
    status: string
    priority: string
    createdAt: Date
    updatedAt: Date
    viewedAt: Date | null
    resolvedAt: Date | null
    department: {
        id: string
        name: string
        icon: string | null
        color: string | null
    }
    city: {
        id: string
        name: string
    }
    ward: {
        id: string
        number: number
        name: string | null
    } | null
    assignedAuthority: {
        id: string
        designation: string
        level: number
        user: {
            name: string | null
            email: string
        }
    } | null
    statusLogs: {
        id: string
        status: string
        notes: string | null
        createdAt: Date
        authority: {
            designation: string
            user: {
                name: string | null
            }
        } | null
    }[]
    satisfactionRating: {
        rating: number
        feedback: string | null
    } | null
}

export interface AuthorityProfile {
    id: string
    designation: string
    level: number
    avgResponseTime: number | null
    resolutionRate: number | null
    totalComplaints: number
    resolvedComplaints: number
    pendingComplaints: number
    performanceScore: number | null
    user: {
        name: string | null
        email: string
    }
    department: {
        name: string
        icon: string | null
    }
    ward: {
        number: number
        name: string | null
    } | null
}

export interface DashboardStats {
    total: number
    pending: number
    inProgress: number
    resolved: number
    escalated: number
}

export const DEPARTMENTS: DepartmentInfo[] = [
    {
        id: 'health',
        name: 'Health & Hospitals',
        slug: 'health-hospitals',
        description: 'Healthcare services, hospitals, and medical facilities',
        icon: 'Heart',
        color: '#ef4444'
    },
    {
        id: 'roadways',
        name: 'Roadways & Transport',
        slug: 'roadways-transport',
        description: 'Roads, highways, public transport, and traffic management',
        icon: 'Car',
        color: '#f59e0b'
    },
    {
        id: 'water',
        name: 'Water Supply & Drainage',
        slug: 'water-supply',
        description: 'Water supply, drainage, and sewage systems',
        icon: 'Droplets',
        color: '#3b82f6'
    },
    {
        id: 'electricity',
        name: 'Electricity',
        slug: 'electricity',
        description: 'Power supply, electrical infrastructure, and outages',
        icon: 'Zap',
        color: '#eab308'
    },
    {
        id: 'food',
        name: 'Food & Public Distribution',
        slug: 'food-distribution',
        description: 'Ration shops, food quality, and public distribution system',
        icon: 'Wheat',
        color: '#84cc16'
    },
    {
        id: 'education',
        name: 'Education',
        slug: 'education',
        description: 'Schools, colleges, and educational institutions',
        icon: 'GraduationCap',
        color: '#8b5cf6'
    },
    {
        id: 'police',
        name: 'Police & Safety',
        slug: 'police-safety',
        description: 'Law enforcement, public safety, and emergency services',
        icon: 'Shield',
        color: '#1e40af'
    },
    {
        id: 'municipal',
        name: 'Municipal Services',
        slug: 'municipal-services',
        description: 'Sanitation, waste management, and civic amenities',
        icon: 'Building2',
        color: '#0d9488'
    },
    {
        id: 'vigilance',
        name: 'Corruption & Vigilance',
        slug: 'corruption-vigilance',
        description: 'Anti-corruption complaints and vigilance matters',
        icon: 'Eye',
        color: '#dc2626'
    }
]
