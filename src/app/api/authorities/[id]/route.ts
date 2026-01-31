import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await req.json()
        const { name, email, designation, departmentId, level, jurisdiction, isActive } = body

        if (!name || !email || !designation || !departmentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const auth = await prisma.authority.findUnique({
            where: { id }
        })

        if (!auth) {
            return NextResponse.json({ error: "Authority not found" }, { status: 404 })
        }

        // Update User info (Name, Email)
        await prisma.user.update({
            where: { id: auth.userId },
            data: {
                name,
                email
            }
        })

        // Update Authority info
        const updatedAuth = await prisma.authority.update({
            where: { id },
            data: {
                designation,
                departmentId,
                level: parseInt(level),
                isActive
            },
            include: {
                user: true,
                department: true
            }
        })

        return NextResponse.json({
            success: true,
            authority: {
                id: updatedAuth.id,
                name: updatedAuth.user.name,
                email: updatedAuth.user.email,
                designation: updatedAuth.designation,
                department: updatedAuth.department.name,
                departmentId: updatedAuth.departmentId,
                level: updatedAuth.level,
                jurisdiction: jurisdiction || "General",
                isActive: updatedAuth.isActive
            }
        })

    } catch (error: any) {
        console.error("Update authority error:", error)
        if (error.code === 'P2002') { // Unique constraint failed (likely email)
            return NextResponse.json({ error: "Email already in use by another user" }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update authority" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params

        await prisma.authority.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete authority" }, { status: 500 })
    }
}
