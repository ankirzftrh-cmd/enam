/**
 * Custom Server for cPanel "Setup Node.js App"
 * 
 * This file is required for running Next.js on cPanel hosting.
 * cPanel looks for server.js or app.js to start the Node.js application.
 * 
 * Usage:
 * 1. Build the app: npm run build
 * 2. In cPanel "Setup Node.js App", set:
 *    - Application root: /path/to/your/app
 *    - Application startup file: server.js
 *    - Node.js version: 18.x or higher
 * 3. Set environment variables in cPanel
 * 4. Restart the application
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// When using standalone output, we need to use the built server
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }).listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> Environment: ${dev ? 'development' : 'production'}`);
    });
});
