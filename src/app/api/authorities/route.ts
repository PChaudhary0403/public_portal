import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { name, email, designation, departmentId, level, jurisdiction } = body

        // Validation
        if (!email || !name || !designation || !departmentId) {
            return NextResponse.json({ error: "Missing required fields: Name, Email, Designation, and Department are required." }, { status: 400 })
        }

        // 1. Check if user exists or create new one
        let user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Default password for new authorities
            const hashedPassword = await hash("authority123", 12)
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "AUTHORITY",
                    emailVerified: new Date(),
                }
            })
        } else {
            // Update existing user to be an AUTHORITY
            await prisma.user.update({
                where: { id: user.id },
                data: { role: "AUTHORITY" }
            })
        }

        // 2. Check if authority profile already exists
        const existingAuth = await prisma.authority.findUnique({
            where: { userId: user.id }
        })

        if (existingAuth) {
            return NextResponse.json({ error: "User is already an authority" }, { status: 400 })
        }

        // 3. Create Authority profile
        try {
            const authority = await prisma.authority.create({
                data: {
                    userId: user.id,
                    departmentId,
                    designation,
                    level: parseInt(level),
                    // mapping jurisdiction text to specific IDs would happen here
                },
                include: {
                    user: true,
                    department: true
                }
            })

            return NextResponse.json({
                success: true,
                authority: {
                    id: authority.id,
                    name: user.name,
                    email: user.email,
                    designation: authority.designation,
                    department: authority.department.name,
                    level: authority.level,
                    jurisdiction: jurisdiction || "General",
                    isActive: authority.isActive
                }
            })
        } catch (dbError: any) {
            console.error("Database error creating authority:", dbError)
            // Check for foreign key constraint violation (e.g. invalid departmentId)
            if (dbError.code === 'P2003') {
                return NextResponse.json({ error: "Invalid Department ID. Please select a valid department." }, { status: 400 })
            }
            throw dbError // Re-throw to outer catch
        }

    } catch (error: any) {
        console.error("Failed to create authority:", error)
        return NextResponse.json({ error: error.message || "Failed to create authority" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const authorities = await prisma.authority.findMany({
            include: {
                user: true,
                department: true
            }
        })

        const formattedAuthorities = authorities.map(auth => ({
            id: auth.id,
            name: auth.user.name,
            email: auth.user.email,
            designation: auth.designation,
            department: auth.department.name,
            departmentId: auth.departmentId, // Added this
            level: auth.level,
            jurisdiction: "General",
            isActive: auth.isActive
        }))

        return NextResponse.json(formattedAuthorities)

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch authorities" }, { status: 500 })
    }
}
