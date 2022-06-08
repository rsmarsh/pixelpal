import './src/env.js';
import startHTTPServer from './src/http-server.js';
import { WebSocketServer } from 'ws';
import PixelGrid from './src/PixelGrid.js';
import { initialisePixelComms } from './src/pixelgrid-comms.js';

const developmentMode = true;

// for production only, the nodejs app takes over handling of the page delivery over webpack-dev-server
const { primaryServer } = startHTTPServer(developmentMode);

// Create the object to store the main pixel grid state
const pixelGrid = new PixelGrid('main', 16, 16);

// Initialise the WebSocket server to receive all connecting clients
const wss = new WebSocketServer({
    server: primaryServer,
    path: '/ws'
});

// adds all the websocket listeners and responses for this pixelgrid/wss instance
initialisePixelComms(pixelGrid, wss);
