import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // ===== VALIDATION BLOCK =====
        // 1. Required Fields
        if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
            return NextResponse.json({ error: "Product name is required" }, { status: 400 });
        }
        if (!body.description || body.description.trim() === '') {
            return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }
        if (!body.categoryId) {
            return NextResponse.json({ error: "Category is required" }, { status: 400 });
        }
        if (!body.price || isNaN(parseFloat(body.price)) || parseFloat(body.price) <= 0) {
            return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
        }

        // 2. Validate Category Exists
        const categoryId = parseInt(body.categoryId);
        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId }
        });
        if (!categoryExists) {
            return NextResponse.json({ error: `Category ID ${categoryId} does not exist` }, { status: 400 });
        }

        // ===== SLUG GENERATION =====
        const slug = body.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();

        // ===== CREATE PRODUCT =====
        const product = await prisma.product.create({
            data: {
                name: body.name.trim(),
                description: body.description.trim(),
                price: Math.floor(parseFloat(body.price)), // Ensure Integer
                weight: parseFloat(body.weight || 0),
                categoryId: categoryId,
                image: body.image || null,
                images: body.images || (body.image ? [body.image] : []),
                stockStatus: body.stockStatus || "READY",
                slug: slug,
                isNew: body.isNew || false,
                isBestSeller: body.isBestSeller || false,
                stock: parseInt(body.stock) || 10,
                purity: body.purity || null,
                thickness: body.thickness || null,
                dimensions: body.dimensions || null
            }
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Create Product Error:", error);
        // Return more specific error if it's a Prisma known error
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create product: " + (error.message || 'Unknown error') }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        // Body should include id
        if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const product = await prisma.product.update({
            where: { id: parseInt(body.id) },
            data: {
                name: body.name,
                description: body.description,
                price: parseFloat(body.price),
                weight: parseFloat(body.weight || 0),
                stock: parseInt(body.stock) || 0,
                categoryId: parseInt(body.categoryId),
                image: body.image,
                images: body.images || [],
                stockStatus: body.stockStatus,
                isNew: body.isNew,
                isBestSeller: body.isBestSeller,
                purity: body.purity || null,
                thickness: body.thickness || null,
                dimensions: body.dimensions || null
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
