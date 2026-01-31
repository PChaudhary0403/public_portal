import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
    try {
        const departments = await prisma.department.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json(departments)
    } catch (error) {
        console.error("Error fetching departments:", error)
        return NextResponse.json(
            { error: "Failed to fetch departments" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, description, icon, color } = body

        const department = await prisma.department.create({
            data: {
                name,
                slug,
                description,
                icon,
                color,
            },
        })

        return NextResponse.json(department, { status: 201 })
    } catch (error) {
        console.error("Error creating department:", error)
        return NextResponse.json(
            { error: "Failed to create department" },
            { status: 500 }
        )
    }
}
