
const https = require('https');

const clientId = "FM-0165-a49a07a1dc146868b66bbb89";
const secretKey = "FMPA-24236666ebdf57f3f720ccf5130cf7661afc";
const baseUrl = "https://sandbox-secure.flashmobile.id";

const postData = JSON.stringify({
    client_key: clientId,
    secret_key: secretKey
});

const options = {
    hostname: 'sandbox-secure.flashmobile.id',
    port: 443,
    path: '/auth/v2/access-token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

console.log("Testing Auth Request...");
console.log(`URL: ${baseUrl}/auth/v2/access-token`);
console.log(`Body: ${postData}`);

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
