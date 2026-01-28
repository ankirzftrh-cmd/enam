
require('dotenv').config();

const BASE_URL = "https://secure.flashmobile.id";
const CLIENT_KEY = process.env.FLASH_CLIENT_KEY || process.env.FLASH_MOBILE_CLIENT_ID;
const SECRET_KEY = process.env.FLASH_SECRET_KEY || process.env.FLASH_MOBILE_SECRET_KEY;

if (!CLIENT_KEY || !SECRET_KEY) {
    console.error("Missing FLASH_CLIENT_KEY or FLASH_SECRET_KEY in .env");
    process.exit(1);
}

const ENDPOINTS = [
    "/access-token",
    "/api/v1/access-token",
    "/auth/access-token",
    "/v1/access-token",
    "/oauth/token",
    "/api/v1/auth/token"
];

async function probe() {
    console.log(`Probing Flash Mobile at ${BASE_URL}...`);
    console.log(`Client Key: ${CLIENT_KEY.substring(0, 5)}...`);

    for (const path of ENDPOINTS) {
        const url = `${BASE_URL}${path}`;
        console.log(`\nTesting: ${url}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_key: CLIENT_KEY,
                    secret_key: SECRET_KEY
                })
            });

            const text = await response.text();
            console.log(`Status: ${response.status} ${response.statusText}`);

            // Try to parse JSON to see if it's a valid API response
            try {
                const json = JSON.parse(text);
                console.log("Response Type: JSON (Valid)");
                console.log("Preview:", JSON.stringify(json).substring(0, 150));

                if (response.ok) {
                    console.log(">>> SUCCESS! Found valid endpoint.");
                } else {
                    console.log(">>> Endpoint reachable but returned error (check credentials/whitelist).");
                }
            } catch (e) {
                console.log("Response Type: HTML/String (Likely Invalid Endpoint)");
                console.log("Preview:", text.substring(0, 100).replace(/\n/g, " "));
            }

        } catch (err) {
            console.error("Network Error:", err.message);
        }
    }
}

probe();
