
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Syncing categories based on user request...')

    // Define the full hierarchy
    const categories = [
        {
            name: 'Emas Batangan',
            slug: 'emas-batangan',
            children: []
        },
        {
            name: 'Produk Tematik',
            slug: 'produk-tematik',
            children: [
                { name: 'Emas Imlek', slug: 'emas-imlek' },
                { name: 'Emas Idul Fitri', slug: 'emas-idul-fitri' },
                { name: 'Perak Indonesian Heritage', slug: 'perak-indonesian-heritage' },
                { name: 'Emas Batangan Batik', slug: 'emas-batangan-batik' }
            ]
        },
        {
            name: 'Gift Series',
            slug: 'gift-series',
            children: [
                { name: 'Happy Birthday', slug: 'gift-birthday' },
                { name: 'Wedding', slug: 'gift-wedding' },
                { name: 'Thank You', slug: 'gift-thank-you' },
                { name: 'New Born', slug: 'gift-new-born' },
                { name: 'Barakallahu Fii Umrik', slug: 'gift-barakallah' }
            ]
        },
        {
            name: 'Produk Lain',
            slug: 'produk-lain',
            children: [
                { name: 'Liontin Batik', slug: 'liontin-batik' },
                { name: 'Produk Industri', slug: 'produk-industri' },
                { name: 'Perak Murni', slug: 'perak-murni' },
                { name: 'Produk Klasik', slug: 'produk-klasik' }
            ]
        }
    ]

    for (const cat of categories) {
        console.log(`Processing Parent: ${cat.name}`)

        // 1. Upsert Parent
        const parent = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name }, // Ensure name matches
            create: { name: cat.name, slug: cat.slug, parentId: null }
        })

        // 2. Upsert Children
        for (const child of cat.children) {
            console.log(`  - Processing Child: ${child.name}`)
            await prisma.category.upsert({
                where: { slug: child.slug },
                update: {
                    name: child.name,
                    parentId: parent.id // Move to correct parent if changed
                },
                create: {
                    name: child.name,
                    slug: child.slug,
                    parentId: parent.id
                }
            })
        }
    }

    console.log('Category sync complete!')
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
