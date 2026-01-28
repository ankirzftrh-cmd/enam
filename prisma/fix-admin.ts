import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@emasantam.com'
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })
        console.log(`Success: Admin (${email}) password has been hashed.`)
    } catch (error) {
        console.error("Error updating admin password:", error)
    }
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
