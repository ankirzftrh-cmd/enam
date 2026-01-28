import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { stockStatus: { not: "EMPTY" } },
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation
        if (!body.name || !body.price) {
            return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
        }
        if (!body.categoryId) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        // Generate Slug (REQUIRED BY DATABASE)
        const slug = body.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();

        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description || '',
                price: Math.floor(parseFloat(body.price)), // Ensure Integer
                weight: parseFloat(body.weight || 0),
                categoryId: parseInt(body.categoryId),
                image: body.image || null,
                images: body.images || (body.image ? [body.image] : []),
                stockStatus: body.stockStatus || "READY",
                slug: slug, // CRITICAL: Required field
                isNew: body.isNew || false,
                isBestSeller: body.isBestSeller || false
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Create Product Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A product with similar name already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create product: ' + (error.message || 'Unknown error') }, { status: 500 });
    }
}
