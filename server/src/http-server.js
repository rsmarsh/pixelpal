import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const HTTP_PORT = process.env.HTTP_PORT || 3030;
const HTTPS_PORT = process.env.HTTPS_PORT || 3031;
const app = express();

// allow express to server files from the /client/dist/ directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(distPath));

// an array of all the different https urls which will point to this server
const urlList = JSON.parse(process.env.URLS);
if (!Array.isArray(urlList)) {
    throw Error('At least one domain must be specified in the .env file as an array. See .env.example');
}

function createDevServer() {
    const app = express();
    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT, () => console.log("Backend dev server listening on port " + HTTP_PORT));
    return httpServer;
}

// Creates both an HTTP and HTTPS server, with autoupgrading enabled
export default function startHTTPServer(isDevMode) {

    // set up a simple wss server if running locally, with no https or certs required
    if (isDevMode) {
        const devServer = createDevServer();

        return {
            httpServer: devServer,
            primaryServer: devServer
        }
    }

    const httpsServer = https.createServer(app);

    // don't modify the original URL list
    const urls = [...urlList];

    // provide all the other https domain name certs to the server
    while (urls.length > 0) {
        const nextUrl = urls.shift();

        if (!nextUrl) {
            throw Error('Malformed domain list error. See .env.example');
        }

        httpsServer.addContext(nextUrl, {
            key: fs.readFileSync(`${process.env.HTTPS_PATH}/${nextUrl}/${process.env.HTTPS_KEY}`),
            cert: fs.readFileSync(`${process.env.HTTPS_PATH}/${nextUrl}/${process.env.HTTPS_CERT}`)
        });

        console.log("Listening on https url: " + nextUrl);
    }

    httpsServer.listen(HTTPS_PORT, () => {
        console.log('Server running and ready for requests');
    });

    // HTTP server to upgrade non-secure requests to https
    const httpServer = http.createServer((req, res) => {
        res.writeHead(302, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    });

    return {
        httpServer,
        httpsServer,
        primaryServer: httpsServer
    };
};

