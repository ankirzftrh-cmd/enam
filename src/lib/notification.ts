
// import nodemailer from "nodemailer";

export const sendCustomNotification = async (order: any, eventType: 'CREATED' | 'PAID') => {
    console.log(`[NOTIFICATION SYSTEM] Starting notification for Order ${order.orderId} [${eventType}]`);

    const companyName = "PT. BELM ANTAM Tbk";
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/images/logo1.webp`;

    let waMessage = "";

    if (eventType === 'CREATED') {
        waMessage = `*${companyName}*\n\nHalo ${order.customerName},\n\nPesanan Anda *${order.orderId}* berhasil dibuat.\nTotal: Rp ${order.totalAmount.toLocaleString('id-ID')}\n\nSilakan lakukan pembayaran melalui link berikut:\n${order.paymentUrl}\n\nSalam,\n${companyName}`;
    } else if (eventType === 'PAID') {
        waMessage = `*${companyName}*\n\nHalo ${order.customerName},\n\nTerima kasih! Pembayaran untuk pesanan *${order.orderId}* sebesar Rp ${order.totalAmount.toLocaleString('id-ID')} telah kami terima.\n\nBarang akan segera kami proses.\n\nSalam,\n${companyName}`;
    }

    // 1. Send WhatsApp
    await sendWhatsApp(order.customerPhone, waMessage, logoUrl);

    // 2. Email Disabled temporarily
    // await sendEmail(order.customerEmail, "Subject", "Body");
};

// --- Helpers ---

async function sendWhatsApp(phone: string, message: string, imageUrl?: string) {
    if (!phone) return;

    const token = process.env.FONNTE_TOKEN;
    if (!token) {
        console.warn("FONNTE_TOKEN is missing in .env, skipping WhatsApp send.");
        return;
    }

    // Fonnte cannot download images from localhost. Skip image if on localhost.
    let finalUrl = imageUrl;
    if (imageUrl && (imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1"))) {
        console.warn("[WA WARNING] Logo URL is localhost. Fonnte cannot download it. Sending text only.");
        finalUrl = undefined;
    }

    // Fonnte API logic (Using JSON for stability)
    try {
        const body: any = {
            target: phone,
            message: message,
        };
        if (finalUrl) {
            body.url = finalUrl;
        }

        const response = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();
        console.log(`[WA SOCKET] To: ${phone} | Result:`, JSON.stringify(result));

        if (!result.status) {
            console.error("[WA ERROR] Fonnte returned false status. Check Device Connection / Token.");
        }
    } catch (error) {
        console.error("Failed to send WhatsApp:", error);
    }
}

/*
async function sendEmail(email: string, subject: string, html: string) {
    if (!email) return;

    const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };

    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.warn("[EMAIL WARNING] SMTP credentials missing in .env. Skipping email.");
        return;
    }

    try {
        // const transporter = nodemailer.createTransport(smtpConfig);
        // ... sending logic
    } catch (error) {
        console.error("[EMAIL ERROR] Failed to send email:", error);
    }
}
*/
