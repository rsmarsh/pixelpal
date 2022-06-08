import React, { useEffect, useRef, useState } from 'react';
import PixelGrid from 'Components/PixelGrid/PixelGrid';
import ColourPicker from 'Components/ColourPicker/ColourPicker';
import { randomColour } from 'Utils/colour';
import './DrawGrid.scss';

import useWebSocket from 'Hooks/useWebSocket';

type RGBColour = { r: number; g: number; b: number };

const DrawGrid = () => {
  const defaultColour = randomColour();

  const [userCount, setUserCount] = useState(1);
  const [gridState, setGridState] = useState([]);
  const [paintCount, setPaintCount] = useState<number>(0);
  const [activeColour, setActiveColour] = useState<RGBColour>(defaultColour);
  // The eye dropper is active when the user is taking a used colour from the grid
  const [eyeDropperActive, setEyeDropperActive] = useState(false);
  const gridStateRef = useRef(gridState);

  useEffect(() => {
    gridStateRef.current = gridState;
  }, [gridState]);

  const receiveMessage = (label: string, data: any) => {
    console.log('ws message', label, data);

    if (label === 'user-count') {
      setUserCount(data.count as number);
    }

    if (label === 'paint-count') {
      setPaintCount(data.count as number);
    }

    if (label === 'grid-state') {
      setGridState(data as number[][]);
    }

    if (label === 'external-cell-change') {
      const { x, y, colour } = data as {
        x: number;
        y: number;
        colour: {
          r: number;
          g: number;
          b: number;
        };
      };
      const newGridState = [...gridStateRef.current];
      newGridState[x][y] = { r: colour.r, g: colour.g, b: colour.b };
      setGridState(newGridState);
      incrementPaintCount();
    }
  };

  // check for local dev mode 🤷‍♂️
  const WSUrl =
    process.env.NODE_ENV === 'development'
      ? `${window.location.hostname}:3001`
      : window.location.hostname;

  const [wsSend, wsConnected] = useWebSocket(WSUrl, {
    message: receiveMessage,
    error: console.error
  });

  const incrementPaintCount = () => {
    setPaintCount((oldCount) => oldCount + 1);
  };

  const handleGridChange = (
    x: number,
    y: number,
    newColour: { r: number; g: number; b: number },
    currentColour: { r: number; g: number; b: number }
  ) => {
    // this is a local only action, to change the active colour
    if (eyeDropperActive) {
      setActiveColour({ r: currentColour.r, g: currentColour.g, b: currentColour.b });
      return;
    }

    wsSend('cell-change', { x, y, colour: newColour });
    incrementPaintCount();
  };

  return (
    <div>
      {!wsConnected && <h2>Connecting...</h2>}
      <h3>Users Online: {userCount}</h3>
      <h3>Total cells painted: {paintCount}</h3>
      <PixelGrid
        id='Colour-Art'
        width={16}
        height={16}
        gridState={gridState}
        handleChange={handleGridChange}
        activeColour={activeColour}
        eyeDropperActive={eyeDropperActive}
      />
      <div className='colour-picker-container'>
        <ColourPicker
          activeColour={activeColour}
          handleChange={setActiveColour}
          eyeDropperActive={eyeDropperActive}
          setEyeDropperActive={setEyeDropperActive}
        />
      </div>
    </div>
  );
};

export default DrawGrid;
