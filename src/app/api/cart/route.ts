import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch User Cart
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ items: [] });
    }

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: parseInt(userId) },
            include: {
                cartitem: {
                    include: { product: true }
                }
            }
        });

        if (!cart) return NextResponse.json({ items: [] });

        // Map to simplified structure
        const items = cart.cartitem.map(item => ({
            id: item.id, // CartItem ID
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity
        }));

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}

// POST: Add Item or Merge
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, product, operation } = body;
        // operation: 'add' | 'merge_local_storage'

        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Find or Create Cart
        let cart = await prisma.cart.findUnique({ where: { userId: parseInt(userId) } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: parseInt(userId) } });
        }

        if (operation === 'merge_local_storage') {
            const localItems = body.items || [];
            for (const localItem of localItems) {
                // Check if exists
                const existing = await prisma.cartitem.findFirst({
                    where: { cartId: cart.id, productId: localItem.productId }
                });

                if (existing) {
                    await prisma.cartitem.update({
                        where: { id: existing.id },
                        data: { quantity: existing.quantity + localItem.quantity }
                    });
                } else {
                    await prisma.cartitem.create({
                        data: {
                            cartId: cart.id,
                            productId: localItem.productId,
                            quantity: localItem.quantity
                        }
                    });
                }
            }
            return NextResponse.json({ success: true, message: "Merged" });
        }

        else {
            // Normal Add To Cart (Single Item)
            const productId = body.productId;
            const quantity = body.quantity || 1;

            if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

            const existing = await prisma.cartitem.findFirst({
                where: { cartId: cart.id, productId: parseInt(productId) }
            });

            if (existing) {
                await prisma.cartitem.update({
                    where: { id: existing.id },
                    data: { quantity: existing.quantity + quantity }
                });
            } else {
                await prisma.cartitem.create({
                    data: {
                        cartId: cart.id,
                        productId: parseInt(productId),
                        quantity: quantity
                    }
                });
            }
            return NextResponse.json({ success: true });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Cart Error" }, { status: 500 });
    }
}

// DELETE: Remove Item from Cart
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');
        const userId = searchParams.get('userId');

        if (!itemId) {
            return NextResponse.json({ error: "Item ID required" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify item belongs to user's cart
        const cartItem = await prisma.cartitem.findUnique({
            where: { id: parseInt(itemId) },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== parseInt(userId)) {
            return NextResponse.json({ error: "Item not found in your cart" }, { status: 404 });
        }

        await prisma.cartitem.delete({
            where: { id: parseInt(itemId) }
        });

        return NextResponse.json({ success: true, message: "Item removed" });

    } catch (error) {
        console.error("Delete cart item error:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}

// PUT: Update Item Quantity
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { itemId, quantity, userId } = body;

        if (!itemId || !quantity) {
            return NextResponse.json({ error: "Item ID and quantity required" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (quantity < 1) {
            return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
        }

        // Verify item belongs to user's cart
        const cartItem = await prisma.cartitem.findUnique({
            where: { id: parseInt(itemId) },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== parseInt(userId)) {
            return NextResponse.json({ error: "Item not found in your cart" }, { status: 404 });
        }

        const updated = await prisma.cartitem.update({
            where: { id: parseInt(itemId) },
            data: { quantity: parseInt(quantity) }
        });

        return NextResponse.json({ success: true, item: updated });

    } catch (error) {
        console.error("Update cart item error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}
