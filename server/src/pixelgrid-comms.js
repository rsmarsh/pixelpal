import { wrapDataForWs } from './utils.js';

const DEBUG_MODE = false;


class PixelGridComms {
    constructor(pixelGrid, wss) {
        this.pixelGrid = pixelGrid;
        this.wss = wss;

        this.setupWSSComms();
    };

    // creates all the listeners and websocket handlers for the provided wss and pixelgrid instance
    setupWSSComms = () => {
        // Received each time a new client connects from the browser
        this.wss.on('connection', (ws, res) => {

            // Inform all clients of the new user count
            this.sendToAll(wrapDataForWs('user-count', { count: this.wss.clients.size }), this.wss.clients);

            // Send the latest grid state to the new client
            ws.send(
                wrapDataForWs('grid-state', this.pixelGrid.state)
            );

            // send the total paint count to the new client
            ws.send(
                wrapDataForWs('paint-count', { count: this.pixelGrid.changeCount })
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
                    this.pixelGrid.updateState(data.payload.x, data.payload.y, { r, g, b });

                    // Now wrap the new change back up to sent to all other clients
                    // const hexColour = rgbToHex(data.payload.color.r, data.payload.color.g, data.payload.color.b);
                    const cellChangeData = wrapDataForWs('external-cell-change', {
                        x: data.payload.x,
                        y: data.payload.y,
                        color: data.payload.color
                    });

                    // Rebroadcast the new cell update to all clients except the source, since they already know
                    this.sendToAll(cellChangeData, this.wss.clients, ws, true);

                    return;
                }

                // Reaching here means an unrecognised label was sent
                console.log("unrecognised message label: ", data.label);
            });
        });
    };


    // Allows easy sending to all connected websocket clients, with the option to exclude the origin client
    sendToAll = (data, clients, sourceClient, excludeSource) => {
        clients.forEach(client => {
            if (excludeSource && client === sourceClient) return;
            client.send(data);
        });
    };
};


export const initialisePixelComms = (pixelGrid, wss) => {
    return new PixelGridComms(pixelGrid, wss);
};