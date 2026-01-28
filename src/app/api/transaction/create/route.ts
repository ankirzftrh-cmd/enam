
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FlashMobile } from "@/lib/flash-mobile";
import { sendCustomNotification } from "@/lib/notification";
import { notifyCustomerOrderCreated, notifyAdminNewOrder } from "@/lib/fonnte";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, userId, customerDetails, billingAddress, ktpImage, shippingAddress, paymentMethod } = body;

        // ===== INPUT VALIDATION =====
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: "Keranjang kosong. Mohon tambahkan produk." }, { status: 400 });
        }
        if (!customerDetails || !customerDetails.name || !customerDetails.email) {
            return NextResponse.json({ success: false, error: "Data pelanggan tidak lengkap (nama dan email wajib)." }, { status: 400 });
        }
        if (!paymentMethod) {
            return NextResponse.json({ success: false, error: "Metode pembayaran harus dipilih." }, { status: 400 });
        }

        // ===== VALIDATE ITEMS AND CALCULATE TOTAL =====
        const validatedItems = [];
        let calculatedTotal = 0;

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                return NextResponse.json({ success: false, error: "Format item tidak valid." }, { status: 400 });
            }
            const prodId = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId;

            const product = await prisma.product.findUnique({
                where: { id: prodId }
            });

            if (!product) {
                return NextResponse.json({ success: false, error: `Produk dengan ID ${item.productId} tidak ditemukan.` }, { status: 404 });
            }

            const itemTotal = product.price * item.quantity;
            calculatedTotal += itemTotal;

            validatedItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
                name: product.name
            });
        }

        // Generate Order ID
        const newOrderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // ===== PROCESS PAYMENT =====
        let paymentUrl = "";
        let paymentDetailsData = null;

        // Approved Bank List for Virtual Account (FlashPay supported banks only)
        const allowedMethods = ["BNI", "BRI", "MANDIRI", "PERMATA", "CIMB", "BSI"];

        if (!allowedMethods.includes(paymentMethod)) {
            return NextResponse.json({ success: false, error: `Metode pembayaran "${paymentMethod}" tidak didukung.` }, { status: 400 });
        }

        try {
            console.log(`[Transaction] Initiating Flash Mobile Payment for ${newOrderId} via ${paymentMethod}`);

            // Create Virtual Account with TIMEOUT handling (30 seconds)
            const va = await Promise.race([
                FlashMobile.createVirtualAccount({
                    orderId: newOrderId,
                    amount: Math.floor(calculatedTotal),
                    bankCode: paymentMethod,
                    customerName: customerDetails?.name || "Guest",
                    customerEmail: customerDetails?.email
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Payment Gateway Timeout')), 30000))
            ]) as any;

            paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?orderId=${newOrderId}`;

            paymentDetailsData = {
                bankCode: va.bankCode,
                accountNumber: va.accountNumber,
                expiryDate: va.expiryDate,
                amount: va.amount,
                status: va.status,
                provider: "FLASH_MOBILE"
            };

        } catch (paymentErr: any) {
            console.error("Payment Creation Error:", paymentErr);
            // Return user-friendly error messages
            let userMsg = "Gagal membuat pembayaran.";
            if (paymentErr.message?.includes('Timeout')) {
                userMsg = "Payment Gateway tidak merespons. Silakan coba lagi dalam beberapa saat.";
            } else if (paymentErr.message) {
                userMsg = `Pembayaran gagal: ${paymentErr.message}`;
            }
            return NextResponse.json({ success: false, error: userMsg }, { status: 503 }); // 503 Service Unavailable
        }

        // ===== SAVE ORDER TO DATABASE =====
        const order = await prisma.order.create({
            data: {
                orderId: newOrderId,
                user: userId ? { connect: { id: parseInt(userId) } } : undefined,
                totalAmount: calculatedTotal,
                status: "PENDING",
                customerName: customerDetails?.name || "Guest",
                customerEmail: customerDetails?.email || "guest@example.com",
                customerPhone: customerDetails?.phone || "08123456789",
                shippingAddress: shippingAddress ? (typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress)) : "-",
                // @ts-ignore
                billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
                ktpImage: ktpImage || null,
                paymentUrl: paymentUrl,
                // @ts-ignore
                paymentDetails: paymentDetailsData ? paymentDetailsData : undefined,
                orderItems: {
                    create: validatedItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // ===== SEND NOTIFICATIONS =====
        // Email/Legacy notification
        try {
            await sendCustomNotification({ ...order, paymentUrl }, 'CREATED');
        } catch (e) {
            console.error("Email Notification Error (non-critical):", e);
        }

        // WhatsApp Notifications via Fonnte (non-blocking)
        const customerPhone = customerDetails?.phone || "";
        const vaNumber = paymentDetailsData?.accountNumber || "";

        // Send to Customer
        notifyCustomerOrderCreated({
            customerPhone: customerPhone,
            customerName: customerDetails?.name || "Pelanggan",
            orderId: newOrderId,
            amount: calculatedTotal,
            vaNumber: vaNumber,
            bankCode: paymentMethod
        }).catch(err => console.error("[Fonnte] Customer notification failed:", err));

        // Send to Admin
        notifyAdminNewOrder({
            orderId: newOrderId,
            amount: calculatedTotal,
            customerName: customerDetails?.name || "Guest",
            customerPhone: customerPhone
        }).catch(err => console.error("[Fonnte] Admin notification failed:", err));

        return NextResponse.json({
            success: true,
            paymentUrl: paymentUrl,
            orderId: newOrderId
        });

    } catch (error: any) {
        console.error("Transaction Create Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 });
    }
}
