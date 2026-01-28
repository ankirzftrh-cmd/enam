/* eslint-disable */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    }; // Modified to be object, but we might need to flatten it for some components or update components
    stockStatus: string;
}

export async function getProducts() {
    const products = await (prisma as any).product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });
    return products as unknown as Product[];
}

export async function getCategories() {
    return await (prisma as any).category.findMany({
        where: { parentId: null },
        include: { children: true }
    });
}

export async function getAllCategories() {
    return await (prisma as any).category.findMany({
        include: { category: true }
    });
}

export async function getProductById(id: number) {
    const product = await (prisma as any).product.findUnique({
        where: { id },
        include: { category: true }
    });
    return product as unknown as Product | null;
}

export async function addProduct(data: any) {
    return await (prisma as any).product.create({
        data: {
            name: data.name,
            description: data.description || '',
            price: parseFloat(data.price),
            categoryId: parseInt(data.categoryId),
            image: data.image || '',
            stockStatus: data.stockStatus || 'READY'
        }
    });
}

export async function updateProduct(id: number, data: any) {
    return await (prisma as any).product.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            price: data.price ? parseFloat(data.price) : undefined,
            categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
            stockStatus: data.stockStatus
        }
    });
}

export async function deleteProduct(id: number) {
    try {
        await (prisma as any).product.delete({
            where: { id }
        });
        return true;
    } catch {
        return false;
    }
}
