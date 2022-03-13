import React, { useEffect, useRef, useState } from 'react';
import WebSocketClient, { WSHandlers } from '../utils/websocket-client';

type UseWebSocketReturn = [
  (label: string, message?: Record<string, unknown>) => void,
  boolean
];

// Creates a websocket connection as long as the component is mounted
// Automatically connects and returns the websocket connection itself, and the send message function
const useWebSocket = (url: string, handlers: WSHandlers): UseWebSocketReturn => {
  const ws = useRef<WebSocketClient>();
  const [isConnected, setConnected] = useState(false);

  // Last chance to make any changes/logging before the message is sent
  const send = (label: string, message: Record<string, unknown>) => {
    ws.current.send(label, message);
  };

  const connectionEstablished = () => {
    setConnected(true);
    handlers.connected?.();
  };

  const connectionError = (err: Event) => {
    // setConnected(false);
    console.log('connection error');
    handlers.error?.(err);
  };

  // only create the websocket connection once
  if (!ws.current) {
    ws.current = new WebSocketClient(url, {
      connected: connectionEstablished,
      error: connectionError,
      message: handlers.message
    });
  }

  useEffect(() => {
    // close the websocket connection when unmounted
    return () => {
      ws.current.close();
    };
  }, []);

  return [send, isConnected];
};

export default useWebSocket;
