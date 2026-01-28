/* eslint-disable */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting Category Seeding...')

    const categories = [
        "Emas Imlek",
        "Emas Idul Fitri",
        "Perak Indonesian Heritage",
        "Emas Batangan Batik",
        "Liontin Batik",
        "Produk Industri",
        "Perak Murni 99.95%",
        "Produk Klasik",
        "Emas Batangan"
    ];

    for (const name of categories) {
        // Create slug from name
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
            .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens

        console.log(`Upserting category: ${name} (${slug})`);

        await prisma.category.upsert({
            where: { slug: slug },
            update: { name: name },
            create: {
                name: name,
                slug: slug
            }
        });
    }

    console.log('✅ Category Seeding Completed!')
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
