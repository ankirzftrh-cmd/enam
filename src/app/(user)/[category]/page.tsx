/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma as db } from "@/lib/products";
import ProductListClient from "@/components/ProductListClient";
import { notFound } from "next/navigation";

// Use 'any' cast to avoid the stale type errors during this session
const prisma = db as any;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: slugParam } = await params;
    const slug = slugParam;

    // Fetch Category from DB (without include, to avoid runtime relation errors)
    const category = await prisma.category.findUnique({
        where: { slug }
    });

    // If slug doesn't match db categories, show 404
    if (!category) {
        notFound();
    }

    // Manual fetch of children
    const children = await prisma.category.findMany({
        where: { parentId: category.id }
    });

    // Collect all relevant Category IDs (Self + Children)
    const categoryIds = [category.id];
    if (children && children.length > 0) {
        children.forEach((child: any) => categoryIds.push(child.id));
    }

    // Fetch Products for this category OR its children
    const products = await prisma.product.findMany({
        where: {
            categoryId: { in: categoryIds }
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    // Map products to ensure they fit the component interface 
    // (though our `any` cast in products.ts handles the DB side, we ensure it matches the Client Component expectations)
    const mappedProducts = products.map((p: any) => ({
        ...p,
        // Ensure price is number
        price: Number(p.price)
    }));

    return <ProductListClient products={mappedProducts} title={`Beli ${category.name}`} />;
}
