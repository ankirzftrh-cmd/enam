
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reviews = await prisma.review.findMany({
            where: { productId: parseInt(id) },
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const review = await prisma.review.create({
            data: {
                productId: parseInt(id),
                userName: body.userName,
                rating: parseInt(body.rating),
                comment: body.comment,
                date: body.date ? new Date(body.date) : new Date()
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Create review error:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const url = new URL(request.url);
        const reviewId = url.searchParams.get("reviewId");

        if (!reviewId) {
            return NextResponse.json({ error: "Review ID required" }, { status: 400 });
        }

        await prisma.review.delete({
            where: { id: parseInt(reviewId) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
