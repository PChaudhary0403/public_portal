import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const stateId = searchParams.get("stateId")
        const districtId = searchParams.get("districtId")
        const cityId = searchParams.get("cityId")
        const pincode = searchParams.get("pincode")

        // Get all states
        if (!stateId && !districtId && !cityId && !pincode) {
            const states = await prisma.state.findMany({
                orderBy: { name: "asc" },
            })
            return NextResponse.json({ states })
        }

        // Get districts by state
        if (stateId && !districtId) {
            const districts = await prisma.district.findMany({
                where: { stateId },
                orderBy: { name: "asc" },
            })
            return NextResponse.json({ districts })
        }

        // Get cities by district
        if (districtId && !cityId) {
            const cities = await prisma.city.findMany({
                where: { districtId },
                orderBy: { name: "asc" },
            })
            return NextResponse.json({ cities })
        }

        // Get wards by city
        if (cityId) {
            const wards = await prisma.ward.findMany({
                where: { cityId },
                orderBy: { number: "asc" },
            })
            return NextResponse.json({ wards })
        }

        // Search by pincode
        if (pincode) {
            const city = await prisma.city.findFirst({
                where: { pincode },
                include: {
                    district: {
                        include: { state: true },
                    },
                    wards: true,
                },
            })

            if (city) {
                return NextResponse.json({
                    state: city.district.state,
                    district: city.district,
                    city: {
                        id: city.id,
                        name: city.name,
                        pincode: city.pincode,
                    },
                    wards: city.wards,
                })
            }

            return NextResponse.json({ error: "Location not found" }, { status: 404 })
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    } catch (error) {
        console.error("Error fetching locations:", error)
        return NextResponse.json(
            { error: "Failed to fetch locations" },
            { status: 500 }
        )
    }
}
