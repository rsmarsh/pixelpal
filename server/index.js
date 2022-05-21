import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import PixelGrid from './src/PixelGrid.js';
import { initialisePixelComms } from './src/pixelgrid-comms.js';

const app = express();
const PORT = 3000;

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => console.log("Backend server listening on port " + PORT));

// Create the object to store the main pixel grid state
const pixelGrid = new PixelGrid('main', 16, 16);

// Initialise the WebSocket server to receive all connecting clients
const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws'
});

// adds all the websocket listeners and responses for this pixelgrid/wss instance
initialisePixelComms(pixelGrid, wss);
