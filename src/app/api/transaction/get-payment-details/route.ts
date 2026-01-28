import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, error: "Order ID Required" }, { status: 400 });
        }

        // 1. Get Order from DB
        const order = await prisma.order.findUnique({
            where: { orderId: orderId }
        });

        if (!order) {
            // Note: In case of eventually consistent DB, we could adding retries here
            return NextResponse.json({ success: false, error: "Order Not Found" }, { status: 404 });
        }

        // 2. Return Payment Details stored in DB
        // We no longer rely on external Xendit fetch since we store Flash Mobile data directly.

        let paymentInfo = order.paymentDetails as any;

        // Ensure amount is passed (sometimes it's in details, sometimes not)
        const amount = paymentInfo?.amount || order.totalAmount;

        return NextResponse.json({
            success: true,
            status: order.status, // Order Status (PENDING, PAID, etc.)
            amount: amount,
            expiryDate: paymentInfo?.expiryDate,
            paymentDetails: paymentInfo, // Return the full JSON object

            // Legacy / Compatibility fields if frontend expects them:
            availableBanks: paymentInfo?.bankCode ? [{
                bankCode: paymentInfo.bankCode,
                bankAccountNumber: paymentInfo.accountNumber,
                transferAmount: amount
            }] : [],
            invoiceUrl: order.paymentUrl
        });

    } catch (error) {
        console.error("Payment Details Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
