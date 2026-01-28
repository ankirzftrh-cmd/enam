/**
 * Fonnte WhatsApp API Integration
 * API Endpoint: https://api.fonnte.com/send
 * 
 * Used for sending real-time WhatsApp notifications
 * for order creation and payment updates.
 */

interface SendWhatsAppParams {
    target: string;
    message: string;
}

interface FonnteResponse {
    status: boolean;
    detail?: string;
    id?: string;
}

/**
 * Format phone number for Fonnte API
 * Handles both "0812..." and "62812..." formats
 */
function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }

    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }

    return cleaned;
}

/**
 * Send WhatsApp message via Fonnte API
 * 
 * @param target - Phone number (any format: 0812xxx, 62812xxx, +62812xxx)
 * @param message - Message text to send
 * @returns Promise with result or null if failed
 */
export async function sendWhatsApp(target: string, message: string): Promise<FonnteResponse | null> {
    const token = process.env.FONNTE_TOKEN;

    // Validation: Don't crash if token is missing
    if (!token) {
        console.warn("[Fonnte] ⚠️ FONNTE_TOKEN is not set in environment. WhatsApp notification skipped.");
        return null;
    }

    if (!target || !message) {
        console.warn("[Fonnte] ⚠️ Target or message is empty. Skipping notification.");
        return null;
    }

    const formattedPhone = formatPhoneNumber(target);

    try {
        console.log(`[Fonnte] 📤 Sending WhatsApp to ${formattedPhone}...`);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                target: formattedPhone,
                message: message
            })
        });

        const result: FonnteResponse = await response.json();

        if (result.status) {
            console.log(`[Fonnte] ✅ Message sent successfully to ${formattedPhone}`);
        } else {
            console.error(`[Fonnte] ❌ Failed to send: ${result.detail || 'Unknown error'}`);
        }

        return result;

    } catch (error: any) {
        console.error(`[Fonnte] ❌ Error sending WhatsApp:`, error.message);
        return null;
    }
}

/**
 * Send order notification to customer
 */
export async function notifyCustomerOrderCreated(params: {
    customerPhone: string;
    customerName: string;
    orderId: string;
    amount: number;
    vaNumber: string;
    bankCode: string;
}): Promise<void> {
    const message = `Halo ${params.customerName},

Terima kasih! Pesanan *${params.orderId}* senilai *Rp ${params.amount.toLocaleString('id-ID')}* telah dibuat.

Silakan selesaikan pembayaran melalui Virtual Account berikut:
🏦 Bank: *${params.bankCode}*
💳 No. VA: *${params.vaNumber}*

Pesanan akan diproses setelah pembayaran dikonfirmasi.

Butik Emas Antam`;

    await sendWhatsApp(params.customerPhone, message);
}

/**
 * Send order notification to admin
 */
export async function notifyAdminNewOrder(params: {
    orderId: string;
    amount: number;
    customerName: string;
    customerPhone: string;
}): Promise<void> {
    const adminWa = process.env.ADMIN_WA;

    if (!adminWa) {
        console.warn("[Fonnte] ⚠️ ADMIN_WA not set. Admin notification skipped.");
        return;
    }

    const message = `🚨 *BOSS! Ada Order Baru!*

📦 Order ID: *${params.orderId}*
💰 Nominal: *Rp ${params.amount.toLocaleString('id-ID')}*
👤 Customer: ${params.customerName}
📱 HP: ${params.customerPhone}

Status: ⏳ *Pending*

Cek dashboard admin untuk detail.`;

    await sendWhatsApp(adminWa, message);
}

/**
 * Send payment success notification to customer
 */
export async function notifyCustomerPaymentSuccess(params: {
    customerPhone: string;
    customerName: string;
    orderId: string;
    amount: number;
}): Promise<void> {
    const message = `✅ *Pembayaran Berhasil!*

Halo ${params.customerName},

Pembayaran untuk pesanan *${params.orderId}* sebesar *Rp ${params.amount.toLocaleString('id-ID')}* telah kami terima.

Pesanan Anda sedang diproses dan akan segera dikirim. Terima kasih!

Butik Emas Antam`;

    await sendWhatsApp(params.customerPhone, message);
}
