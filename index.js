import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { rgbToHex, wrapDataForWs } from './src/utils.js';

let pixelsChanged = 0;
const pixelStates = {};

// Updates the state of the pixel array after each change
const updateState = (x, y, { r, g, b }) => {
    if (!pixelStates[x]) {
        pixelStates[x] = {}
    }

    const hex = rgbToHex(r, g, b);
    pixelStates[x][y] = hex;
};

const triggerPixelChange = (x, y, { r, g, b }) => {
    updateState(x, y, { r, g, b });
    // setPixel(x, y, { r, g, b });
    pixelsChanged += 1;
}

const server = express();
server.use(express.static('public'));

server.get('/pixel/clear', (req, res) => {
    res.send('cleared');
    pixelStates = {};
});



// HTTP server to upgrade non-secure requests to https
const httpServer = http.createServer(server);
httpServer.listen(3001, () => console.log("Listening on 3001"));

const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws'

});



wss.on('connection', (ws, res) => {
    // send the current grid state to the connected client
    ws.send(wrapDataForWs('grid-state', pixelStates));
    ws.send(wrapDataForWs('paint-count', { count: pixelsChanged }));

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        if (data.label === 'cell-change') {
            triggerPixelChange(data.payload.x, data.payload.y, { r: data.payload.r, g: data.payload.g, b: data.payload.b });

            // wrap it back up and send to all connected clients
            const hexColour = rgbToHex(data.payload.r, data.payload.g, data.payload.b);
            const payload = { x: data.payload.x, y: data.payload.y, hex: hexColour };

            wss.clients.forEach(client => {
                // don't rebroadcast back to source client
                if (client !== ws) {
                    client.send(wrapDataForWs('external-cell-change', payload));
                }
            });

        } else {
            console.log("unrecognised message label:", data.label);
        }
    });
});