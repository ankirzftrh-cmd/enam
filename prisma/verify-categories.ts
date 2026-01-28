/* eslint-disable */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Verifying Categories...')
    const categories = await prisma.category.findMany()
    console.log('found categories:', categories.length)
    categories.forEach(c => console.log(`- ${c.name} (${c.slug})`))
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
