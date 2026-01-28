/* eslint-disable */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Seeding database...");
    try {
        // Clear existing data? 
        // await prisma.product.deleteMany({})

        await prisma.product.create({
            data: {
                name: 'Logam Mulia 10g',
                description: 'Emas murni 99.99% bersertifikat Antam LBMA.',
                price: 13500000,
                category: 'Gold Bar',
                image: '/dummy-gold.png',
                stockStatus: 'READY'
            }
        })
        await prisma.product.create({
            data: {
                name: 'Logam Mulia 5g',
                description: 'Emas murni 99.99% bersertifikat Antam LBMA.',
                price: 6800000,
                category: 'Gold Bar',
                image: '/dummy-gold.png',
                stockStatus: 'NOT_READY'
            }
        })
        console.log("Seeding done.");
    } catch (e) {
        console.error("Error seeding:", e);
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
