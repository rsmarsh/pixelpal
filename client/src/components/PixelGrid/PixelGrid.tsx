import React, { useState, useEffect } from 'react';

import PixelCell from 'Components/PixelCell/PixelCell';
import './PixelGrid.scss';

type CellValue = { r: number; g: number; b: number };
type GridState = CellValue[][];

interface PixelGridProps {
  id: string;
  width: number;
  height: number;
  activeColour: { r: number; g: number; b: number };
  gridState: GridState;
  handleChange: (
    x: number,
    y: number,
    color: { r: number; g: number; b: number }
  ) => void;
}

const PixelGrid = (props: PixelGridProps) => {
  // The current state of each pixel within the grid
  const [localGridState, setLocalGridState] = useState<GridState>();

  // Number of changes made to this grid
  const [changeCount, setChangeCount] = useState(0);

  // update the local copy of the gridState each time a copy from the server is received
  useEffect(() => {
    setLocalGridState(props.gridState);
    console.log('local grid updated');
  }, [props.gridState]);

  function getCellColour(x: number, y: number): CellValue {
    const colour = localGridState[x][y];
    return colour;
  }

  // When a single cell is changed, receive the change here and update gridState
  function updateState(x: number, y: number, colour: CellValue) {
    const current = getCellColour(x, y);

    // If this cell is already in the requested colour, completely ignore this click event
    if (
      [current.r, current.g, current.b].join(',') ===
      [colour.r, colour.g, colour.b].join(',')
    ) {
      return;
    }

    const newGridState = [...localGridState];
    newGridState[x][y] = colour;
    setLocalGridState(newGridState);
    setChangeCount(changeCount + 1);

    props.handleChange(x, y, colour);
  }

  function cellChange(x: number, y: number) {
    updateState(x, y, { ...props.activeColour });
  }

  function renderGrid(grid: GridState) {
    return grid.map((column, x) => (
      <div key={x} className='column'>
        {column.map((colour, y) => (
          <PixelCell
            key={`${x}-${y}`}
            cellX={x}
            cellY={y}
            colour={colour}
            handleClick={() => cellChange(x, y)}
          />
        ))}
      </div>
    ));
  }

  return (
    <div className='pixel-grid'>
      {localGridState && renderGrid(localGridState)}
      {!localGridState && <div>Loading...</div>}
    </div>
  );
};

export default PixelGrid;
