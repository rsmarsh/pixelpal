import React, { useEffect, useRef } from 'react';
import WebSocketClient, {WSHandlers} from '../utils/websocket-client';

// Creates a websocket connection as long as the component is mounted
// Automatically connects and returns the websocket connection itself, and the send message function
const useWebSocket = (url: string, handlers: WSHandlers) => {
    const ws = useRef<WebSocketClient>();

    const send = (label: string, message: Record<string, unknown>) => {
        ws.current.send(label, message);
    }

    ws.current = new WebSocketClient(url, {
        connected: handlers.connected,
        error: handlers.error,
        message: handlers.message,
    });

    useEffect(() => {
        // close the websocket connection when unmounted
        return () => {
            ws.current.close();
        }
    })
    
    return [ws.current, send];
};

export default useWebSocket;