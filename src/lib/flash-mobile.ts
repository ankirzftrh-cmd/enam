/**
 * Flash Mobile Payment Gateway Integration
 * Base URL: https://secure.flashmobile.id
 * 
 * Supports Virtual Account payments only:
 * BNI, BRI, MANDIRI, PERMATA, CIMB, BSI
 */

interface FlashConfig {
    clientKey: string;
    secretKey: string;
    baseUrl: string;
}

const config: FlashConfig = {
    clientKey: process.env.FLASH_CLIENT_KEY || "",
    secretKey: process.env.FLASH_SECRET_KEY || "",
    baseUrl: process.env.FLASH_BASE_URL || "https://secure.flashmobile.id"
};

// Map frontend bank selection to FlashPay payment_type values
const PAYMENT_TYPE_MAP: Record<string, string> = {
    "BNI": "VA_BNI",
    "BRI": "VA_BRI",
    "MANDIRI": "VA_MANDIRI",
    "PERMATA": "VA_PERMATA",
    "CIMB": "VA_CIMB",
    "BSI": "VA_BSI"
};

// Mock VA prefixes for fallback
const MOCK_VA_PREFIXES: Record<string, string> = {
    "BNI": "8808",
    "BRI": "8888",
    "MANDIRI": "8870",
    "PERMATA": "8856",
    "CIMB": "1149",
    "BSI": "9003"
};

export const FlashMobile = {
    /**
     * Get Access Token (Bearer)
     * Endpoint: POST /auth/v2/access-token
     */
    getToken: async (): Promise<string> => {
        try {
            console.log("[FlashMobile] Requesting Access Token...");
            console.log("[FlashMobile] Using client_key:", config.clientKey.substring(0, 10) + "...");

            const response = await fetch(`${config.baseUrl}/auth/v2/access-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_key: config.clientKey,
                    server_key: config.secretKey
                })
            });

            // Read raw response for debugging
            const rawText = await response.text();

            let data;
            try {
                data = JSON.parse(rawText);
            } catch {
                console.error("[FlashMobile] Auth response is not JSON:", rawText.substring(0, 200));
                throw new Error(`Invalid response from auth endpoint: ${rawText.substring(0, 100)}`);
            }

            if (!response.ok) {
                console.error("[FlashMobile] Auth Failed:", data);
                throw new Error(data.message || `Auth failed with status ${response.status}`);
            }

            // Extract token from response: { status: 200, message: "success", data: { token: "..." } }
            const token = data.data?.token || data.token || data.access_token;

            if (!token) {
                console.error("[FlashMobile] No token in response:", data);
                throw new Error("Token not found in response");
            }

            console.log("[FlashMobile] Auth Success - Token received");
            return token;

        } catch (error: any) {
            console.error("[FlashMobile] getToken Error:", error.message);
            throw error;
        }
    },

    /**
     * Create Virtual Account Payment
     * Endpoint: POST /payment/api/v1
     * Header: Authorization: Bearer <token>
     */
    createVirtualAccount: async (params: {
        orderId: string;
        amount: number;
        bankCode: string;
        customerName: string;
        customerEmail?: string;
        customerPhone?: string;
    }) => {
        const paymentType = PAYMENT_TYPE_MAP[params.bankCode];

        if (!paymentType) {
            throw new Error(`Unsupported bank code: ${params.bankCode}`);
        }

        try {
            console.log(`[FlashMobile] Creating VA for ${params.orderId} (Bank: ${params.bankCode} -> ${paymentType})`);

            // 1. Get Access Token
            const token = await FlashMobile.getToken();

            // 2. Prepare Payload (exact schema from documentation)
            const payload = {
                payment_type: paymentType,
                transaction_amount: Math.floor(params.amount), // MUST be INTEGER
                external_id: params.orderId,
                customer_details: {
                    name: params.customerName,
                    email: params.customerEmail || "",
                    phone: params.customerPhone || ""
                }
            };

            console.log("[FlashMobile] Payment Payload:", JSON.stringify(payload, null, 2));

            // 3. Send Request
            const response = await fetch(`${config.baseUrl}/payment/api/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            // Read raw response for debugging
            const rawText = await response.text();

            let result;
            try {
                result = JSON.parse(rawText);
            } catch {
                console.error("[FlashMobile] Payment response is not JSON:", rawText.substring(0, 300));
                throw new Error(`Invalid JSON response: ${rawText.substring(0, 100)}`);
            }

            // Check for 403 Forbidden (IP blocked)
            if (response.status === 403) {
                console.warn("[FlashMobile] 403 Forbidden - IP might be blocked. Falling back to mock.");
                throw new Error("403_FORBIDDEN");
            }

            if (!response.ok) {
                console.error("[FlashMobile] Create Payment Failed:", result);
                throw new Error(result.message || `Payment creation failed with status ${response.status}`);
            }

            console.log("[FlashMobile] Payment Success:", result);

            // Map response to standard format
            // Expected response fields: va_number, payment_code, expiry_date, etc.
            return {
                bankCode: params.bankCode,
                accountNumber: result.va_number || result.payment_code || result.data?.va_number || result.data?.payment_code,
                expiryDate: result.expiry_date || result.data?.expiry_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                amount: params.amount,
                status: "PENDING",
                externalId: params.orderId,
                provider: "FLASH_MOBILE"
            };

        } catch (error: any) {
            console.error("[FlashMobile] CRITICAL ERROR:", error.message);

            // Throw the actual error instead of returning mock data
            throw new Error(`Flash Mobile API Error: ${error.message}`);
        }
    },

    /**
     * Verify callback signature (placeholder - update when docs available)
     */
    verifyCallback: (headers: Headers, body: any): boolean => {
        // TODO: Implement signature verification when FlashPay callback docs are available
        // For now, accept all callbacks (rely on IP whitelist or other security)
        console.log("[FlashMobile] Callback received - verification placeholder");
        return true;
    }
};
