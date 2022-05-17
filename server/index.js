import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { wrapDataForWs } from './src/utils.js';
import PixelGrid from './src/PixelGrid.js';

const DEBUG_MODE = false;

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

// Allows easy sending to all connected websocket clients, with the option to exclude the origin client
const sendToAll = (data, clients, sourceClient, excludeSource) => {
    clients.forEach(client => {
        if (excludeSource && client === sourceClient) return;
        client.send(data);
    });
};

// Received each time a new client connects from the browser
wss.on('connection', (ws, res) => {

    // Inform all clients of the new user count
    sendToAll(wrapDataForWs('user-count', { count: wss.clients.size }), wss.clients);

    // Send the latest grid state to the new client
    ws.send(
        wrapDataForWs('grid-state', pixelGrid.state)
    );

    // send the total paint count to the new client
    ws.send(
        wrapDataForWs('paint-count', { count: pixelGrid.changeCount })
    );

    // All messages after initial connection will fall under this 'message' event
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        if (DEBUG_MODE) console.log("received message: " + data.label + ", payload: " + data.payload);

        // This label is used when a client is reporting a change to the grid
        if (data.label === 'cell-change') {
            if (!data.payload.colour) {
                console.log("missing colour sent: " + data.payload);
                return;
            }

            const { r, g, b } = data.payload.colour;

            if (r === undefined || g === undefined || b === undefined) {
                console.log("invalid colour sent: " + data.payload.colour);
                return;
            }

            if (data.payload.x === undefined || data.payload.y === undefined) {
                console.log("invalid coordinate sent: " + data.payload);
            }

            // Update our local grid state
            pixelGrid.updateState(data.payload.x, data.payload.y, { r, g, b });

            // Now wrap the new change back up to sent to all other clients
            // const hexColour = rgbToHex(data.payload.color.r, data.payload.color.g, data.payload.color.b);
            const cellChangeData = wrapDataForWs('external-cell-change', {
                x: data.payload.x,
                y: data.payload.y,
                color: data.payload.color
            });

            // Rebroadcast the new cell update to all clients except the source, since they already know
            sendToAll(cellChangeData, wss.clients, ws, true);

            return;
        }

        // Reaching here means an unrecognised label was sent
        console.log("unrecognised message label: ", data.label);
    });
});