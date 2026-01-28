/* eslint-disable */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // 1. Create Admin
    const adminEmail = 'admin@emasantam.com'
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } })

    if (!existingUser) {
        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: adminEmail,
                password: await require('bcrypt').hash('admin123', 10),
                role: 'ADMIN',
            },
        })
        console.log('Admin created')
    }

    // 2. Create Categories
    // Define Hierarchy
    const categories = [
        {
            name: 'Emas Batangan',
            slug: 'emas-batangan',
            type: 'parent',
            children: []
        },
        {
            name: 'Produk Tematik',
            slug: 'produk-tematik',
            type: 'parent',
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
            type: 'parent',
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
            type: 'parent',
            children: [
                { name: 'Liontin Batik', slug: 'liontin-batik' },
                { name: 'Produk Industri', slug: 'produk-industri' },
                { name: 'Perak Murni', slug: 'perak-murni' },
                { name: 'Produk Klasik', slug: 'produk-klasik' }
            ]
        }
    ]

    console.log('Seeding categories...')

    for (const cat of categories) {
        // Create or find Parent
        const parent = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: { name: cat.name, slug: cat.slug }
        })

        // Create Children
        for (const child of cat.children) {
            await prisma.category.upsert({
                where: { slug: child.slug },
                update: { parentId: parent.id },
                create: { name: child.name, slug: child.slug, parentId: parent.id }
            })
        }
    }

    console.log('Categories seeded')

    // 3. Create Sample Products
    const products = [
        {
            name: 'Emas Imlek Year of The Horse',
            categoryId: 'emas-imlek',
            price: 23950800,
            image: '/images/emasimlek.jpg', // Ensure this file exists or use a placeholder URL if local file is missing
            weight: 8,
            purity: '99.99%',
            thickness: '0.62 mm',
            dimensions: '33.3 x 20 mm',
            description: 'Produk emas batangan tematik Imlek Year of The Horse tiga dimensi (3D) dibuat menggunakan teknologi modern.'
        },
        {
            name: 'Emas Imlek Shio Kuda',
            categoryId: 'emas-imlek',
            price: 13500000,
            image: '/images/emasimlek.jpg',
            weight: 5,
            purity: '99.99%',
            description: 'Emas Imlek edisi spesial Shio Kuda dengan desain eksklusif.'
        },
        {
            name: 'Emas Batangan 10g',
            categoryId: 'emas-batangan',
            price: 13500000,
            image: '/images/emasbatangan.jpg',
            weight: 10,
            purity: '99.99%',
            stockStatus: 'READY',
            description: 'Logam Mulia Emas Batangan 10 gram dengan kemudahan investasi dan jaminan keaslian.'
        },
        {
            name: 'Emas Batangan 5g',
            categoryId: 'emas-batangan',
            price: 6800000,
            image: '/images/emasbatangan.jpg',
            weight: 5,
            purity: '99.99%',
            stockStatus: 'READY',
            description: 'Investasi cerdas dengan Emas Batangan 5 gram, cocok untuk tabungan jangka menengah.'
        },
        {
            name: 'Silver Heritage 1oz',
            categoryId: 'perak-indonesian-heritage',
            price: 850000,
            image: '/images/perak.jpg',
            weight: 31.1,
            purity: '99.95%',
            stockStatus: 'READY',
            description: 'Perak murni edisi Heritage 1oz, koleksi berharga dengan nilai seni tinggi.'
        }
    ]

    console.log('Seeding products...')

    for (const p of products) {
        // Find category ID by slug
        const category = await prisma.category.findUnique({ where: { slug: p.categoryId } })
        if (category) {
            const slug = p.name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000)

            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    image: p.image, // Ensure these public/images exist or use external placeholder
                    weight: p.weight,
                    purity: p.purity,
                    thickness: p.thickness,
                    dimensions: p.dimensions,
                    categoryId: category.id,
                    slug: slug,
                    description: p.description,
                    stock: 50
                }
            })
        }
    }
    console.log('Products seeded')
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
