import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { rgbToHex, wrapDataForWs } from './src/utils.js';
import PixelGrid from './src/PixelGrid.js';

const app = express();
const PORT = 3000;
// app.use(express.static('../client'));

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => console.log("Backend server listening on port " + PORT));


// Create the object to store the main pixel grid state
const pixelGrid = new PixelGrid('main', 16, 16);

// Initialise the WebSocket server which handles all comms related to pixel grid changes
const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws'
});

// Received each time a new client connects from the browser
wss.on('connection', (ws, res) => {
    console.log("user connected");


    // All messages after initial connection will fall under this 'message' event
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        console.log("received message: " + data.label + ", payload: " + data.payload);

        // When requested, return the latest grid state
        if (data.label === 'req-grid-state') {
            ws.send(
                wrapDataForWs('grid-state', pixelGrid.state)
            );

            return;
        }

        // When requested, return the latest cell change count
        if (data.label === 'req-paint-count') {
            ws.send(
                wrapDataForWs('paint-count', { count: pixelGrid.changeCount })
            );

            return;
        }

        // This label is used when a client is reporting a change to the grid
        if (data.label === 'cell-change') {

            // Update our local grid state
            pixelGrid.updateState(data.payload.x, data.payload.y, {
                r: data.payload.color.r,
                g: data.payload.color.g,
                b: data.payload.color.b
            });

            // Now wrap the new change back up to sent to all other clients
            // const hexColour = rgbToHex(data.payload.color.r, data.payload.color.g, data.payload.color.b);
            const cellChangeData = wrapDataForWs('external-cell-change', {
                x: data.payload.x,
                y: data.payload.y,
                color: data.payload.color
            });

            // Rebroadcast the new cell update to all clients except the source, since they already know
            wss.clients.forEach(client => {
                if (client !== ws) {
                    client.send(cellChangeData);
                }
            });

            return;
        }

        // Reaching here means an unrecognised label was sent
        console.log("unrecognised message label:", data.label);
    });
});