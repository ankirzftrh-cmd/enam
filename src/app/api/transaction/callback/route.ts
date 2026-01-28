import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCustomNotification } from "@/lib/notification";
import { FlashMobile } from "@/lib/flash-mobile";
import { notifyCustomerPaymentSuccess } from "@/lib/fonnte";

export async function POST(request: Request) {
    try {
        // FlashPay callback verification (placeholder - update when signature docs available)
        const isValid = FlashMobile.verifyCallback(request.headers as any, null);
        if (!isValid) {
            console.error("[Callback] Verification failed");
            return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
        }

        const data = await request.json();
        console.log("[FlashPay Callback] Data received:", JSON.stringify(data, null, 2));

        // FlashPay callback expected fields (adjust based on actual callback schema)
        // Common fields: external_id, status, transaction_id, payment_code, etc.
        const externalId = data.external_id || data.reference_id || data.order_id;
        const status = data.status || data.transaction_status;
        const transactionId = data.transaction_id || data.id;

        if (!externalId) {
            console.error("[Callback] Missing external_id in payload");
            return NextResponse.json({ message: "Invalid Payload - missing external_id" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { orderId: externalId },
            include: { orderItems: true }
        });

        if (!order) {
            console.error(`[Callback] Order ${externalId} not found`);
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // FlashPay status values (common patterns: "PAID", "SUCCESS", "COMPLETED", "SETTLED")
        const paidStatuses = ["PAID", "SUCCESS", "COMPLETED", "SETTLED"];
        const expiredStatuses = ["EXPIRED", "FAILED", "CANCELLED"];

        if (paidStatuses.includes(status?.toUpperCase())) {
            // Avoid re-processing if already paid
            if (order.status === "PAID") {
                console.log(`[Callback] Order ${externalId} already marked as PAID`);
                return NextResponse.json({ message: "Already Processed" });
            }

            // Update to PAID
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "PAID"
                }
            });

            // Reduce Stock
            for (const item of order.orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });
            }

            // Log Payment
            await prisma.paymentlog.create({
                data: {
                    orderId: order.id,
                    status: "PAID",
                    rawResponse: JSON.stringify(data)
                }
            });

            console.log(`[Callback] Order ${externalId} marked as PAID`);

            // Send Email Notification
            try {
                await sendCustomNotification(order, 'PAID');
                console.log(`[Callback] Email notification sent for ${externalId}`);
            } catch (notifyErr) {
                console.error(`[Callback] Failed to send email notification for ${externalId}:`, notifyErr);
            }

            // Send WhatsApp Notification via Fonnte (non-blocking)
            notifyCustomerPaymentSuccess({
                customerPhone: order.customerPhone || "",
                customerName: order.customerName || "Pelanggan",
                orderId: order.orderId,
                amount: order.totalAmount
            }).catch(err => console.error(`[Fonnte] Payment success notification failed for ${externalId}:`, err));

        } else if (expiredStatuses.includes(status?.toUpperCase())) {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "EXPIRED" }
            });
            console.log(`[Callback] Order ${externalId} marked as EXPIRED`);
        } else {
            console.log(`[Callback] Unknown status "${status}" for order ${externalId} - no action taken`);
        }

        return NextResponse.json({ message: "OK" });

    } catch (error: any) {
        console.error("[Callback] Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
