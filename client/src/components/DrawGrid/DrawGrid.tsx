import React, { useEffect, useRef, useState } from 'react';
import PixelGrid from 'Components/PixelGrid/PixelGrid';
import ColourPicker from 'Components/ColourPicker/ColourPicker';
import { randomColour } from 'Utils/colour';
import './DrawGrid.scss';

import useWebSocket from 'Hooks/useWebSocket';

type RGBColour = { r: number; g: number; b: number };

const DrawGrid = () => {
  const defaultColour = randomColour();

  const [gridState, setGridState] = useState([]);
  const [paintCount, setPaintCount] = useState<number>(0);
  const [activeColour, setActiveColour] = useState<RGBColour>(defaultColour);
  const gridStateRef = useRef(gridState);

  useEffect(() => {
    gridStateRef.current = gridState;
  }, [gridState]);

  const receiveMessage = (label: string, data: any) => {
    console.log('ws message', label, data);

    if (label === 'paint-count') {
      setPaintCount(data.count as number);
    }

    if (label === 'grid-state') {
      setGridState(data as number[][]);
    }

    if (label === 'external-cell-change') {
      const { x, y, color } = data as {
        x: number;
        y: number;
        color: {
          r: number;
          g: number;
          b: number;
        };
      };
      const newGridState = [...gridStateRef.current];
      newGridState[x][y] = { r: color.r, g: color.g, b: color.b };
      setGridState(newGridState);
      incrementPaintCount(paintCount + 1);
    }
  };

  const [wsSend, wsConnected] = useWebSocket('localhost', {
    message: receiveMessage,
    error: console.error
  });

  const incrementPaintCount = (newCount: number) => {
    setPaintCount(newCount);
  };

  const sendGridUpdate = (
    x: number,
    y: number,
    color: { r: number; g: number; b: number }
  ) => {
    wsSend('cell-change', { x, y, color });
    incrementPaintCount(paintCount + 1);
  };

  useEffect(() => {
    if (wsConnected) {
      wsSend('req-grid-state');
      wsSend('req-paint-count');
    }
  }, [wsConnected]);

  useEffect(() => {
    setPaintCount(paintCount + 1);
  }, [gridState]);

  return (
    <div>
      <h2>Server status: {wsConnected ? 'connected' : 'disconnected'}</h2>
      <h3>Total cells painted: {paintCount}</h3>
      <PixelGrid
        id='Colour-Art'
        width={16}
        height={16}
        gridState={gridState}
        handleChange={sendGridUpdate}
        activeColour={activeColour}
      />
      <div className='colour-picker-container'>
        <ColourPicker initialColour={defaultColour} handleChange={setActiveColour} />
      </div>
    </div>
  );
};

export default DrawGrid;
