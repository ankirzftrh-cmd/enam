import crypto from 'crypto';

export const DUITKU_CONFIG = {
    merchantCode: process.env.DUITKU_MERCHANT_CODE || '',
    apiKey: process.env.DUITKU_API_KEY || '',
    sandboxMode: true, // Set to false in production
    baseUrl: 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry', // Sandbox URL
};

// 1. Generate Signature for Request (MD5)
// Logic: MD5(merchantCode + orderId + amount + apiKey)
export function generateRequestSignature(orderId: string, amount: number) {
    const { merchantCode, apiKey } = DUITKU_CONFIG;
    const dataString = `${merchantCode}${orderId}${amount}${apiKey}`;
    return crypto.createHash('md5').update(dataString).digest('hex');
}

// 2. Generate Signature for Callback Validation (MD5)
// Logic: MD5(merchantCode + amount + orderId + apiKey) -> Note: order might differ slightly in docs, but usually this standard
export function generateCallbackSignature(orderId: string, amount: string | number) {
    const { merchantCode, apiKey } = DUITKU_CONFIG;
    // Duitku Callback Signature logic: MD5(merchantCode + amount + merchantOrderId + apiKey)
    // IMPORTANT: Check exact string format from Duitku docs. Usually amount is string from callback.
    const dataString = `${merchantCode}${amount}${orderId}${apiKey}`;
    return crypto.createHash('md5').update(dataString).digest('hex');
}

// 3. Create Transaction Request
export async function createDuitkuTransaction(params: {
    orderId: string;
    amount: number;
    productDetails: string;
    email: string;
    phoneNumber?: string;
    customerName?: string;
    returnUrl?: string;
    callbackUrl?: string;
}) {
    const signature = generateRequestSignature(params.orderId, params.amount);

    const payload = {
        merchantCode: DUITKU_CONFIG.merchantCode,
        paymentAmount: params.amount,
        paymentMethod: 'VC', // Example: Virtual Account (VC), or leave blank for all
        merchantOrderId: params.orderId,
        productDetails: params.productDetails,
        additionalParam: '',
        merchantUserInfo: '',
        customerVaName: params.customerName || 'Customer',
        email: params.email,
        phoneNumber: params.phoneNumber || '08123456789', // Default if empty
        // itemDetails: [], // Can implement item details if needed, optional
        customerDetail: {
            firstName: params.customerName || 'Customer',
            email: params.email,
            phoneNumber: params.phoneNumber || '',
        },
        callbackUrl: params.callbackUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/callback`,
        returnUrl: params.returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/cart?status=success`,
        signature: signature,
        expiryPeriod: 60, // 60 minutes
    };

    console.log("Duitku Request Payload:", payload);

    try {
        const response = await fetch(DUITKU_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("Duitku Response:", result);

        return result;
    } catch (error) {
        console.error("Duitku Request Error:", error);
        throw error;
    }
}
