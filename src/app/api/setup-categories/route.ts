
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
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

        const results = [];

        for (const name of categories) {
            // Create slug from name
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const cat = await prisma.category.upsert({
                where: { slug: slug },
                update: { name: name },
                create: {
                    name: name,
                    slug: slug
                }
            });
            results.push(cat);
        }

        return NextResponse.json({
            success: true,
            message: "Categories seeded successfully",
            count: results.length,
            categories: results
        });

    } catch (error) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ error: "Failed to seed categories", details: error }, { status: 500 });
    }
}
