type WSLabel = string;
type WSDataPacket = Record<string, unknown>;

export interface WSHandlers {
    connected?: () => void;
    error?: (err: Event) => void;
    message?: (label: string, msg: WSDataPacket) => void;
}

class WSClient {
    wsConnection: WebSocket;
    messageHandler?: (label: WSLabel, msg: WSDataPacket) => void;

    constructor(url: string, handlers: WSHandlers) {
        if (!url) {
            console.error("WS Server URL must be provided");
        }

        if (!handlers.message) {
            console.warn('websocket handler callback function not provided');
            this.messageHandler = () => { /* do nothing */};
        }

        this.messageHandler = handlers.message;

        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
        const echoSocketUrl = socketProtocol + '//' + url + ":3000/ws";

        this.wsConnection = this.#createConnection(echoSocketUrl);
        this.wsConnection.onopen = () => handlers?.connected?.();
        this.wsConnection.onerror = (err) => handlers?.error?.(err);
        this.wsConnection.onmessage = (evt) => this.#receive?.(evt.data);
    };

    send(label: WSLabel, data: WSDataPacket) {
        const wrappedData = this.#wrapData(label, data);
        this.#sendToServer(wrappedData);
    }

    // Converts a JS object into a label/data ready to be sent via web socket
    #wrapData(label: WSLabel, data: WSDataPacket) {
        const wrapped = {
            label: label,
            payload: data
        };

        return JSON.stringify(wrapped);
    };

    #createConnection(url: string) {
        const wsConnection = new WebSocket(url);
        return wsConnection;
    };

    #sendToServer(msg: string) {
        this.wsConnection.send(msg);
    };

    // Receives the data as a stringified JSON object
    #receive(data: string) {
        let dataFromServer;
        try {
            dataFromServer = JSON.parse(data);
        } catch (err) {
            console.error("Error parsing data from server", err);
            return;
        }

        this.messageHandler(dataFromServer.label, dataFromServer.payload);
    };

    close() {
        this.wsConnection.close();
    }
};


export default WSClient;