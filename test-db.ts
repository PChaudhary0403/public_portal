
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to connect to database...')
        await prisma.$connect()
        console.log('✅ Connection successful!')

        const userCount = await prisma.user.count()
        console.log(`✅ Query successful! Found ${userCount} users.`)

    } catch (e) {
        console.error('❌ Connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
