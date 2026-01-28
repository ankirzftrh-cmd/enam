import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@emasantam.com'
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(`Ensuring admin user ${email} exists with correct password...`)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN' // Ensure role is correct
        },
        create: {
            email,
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN'
        }
    })

    console.log(`Success: Admin user ${user.email} is ready. ID: ${user.id}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
