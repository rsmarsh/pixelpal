import React, { useState, useEffect } from 'react';

import PixelCell from './PixelCell';
import './PixelGrid.scss';

type CellValue = { r: number; g: number; b: number };
type GridState = CellValue[][];

interface PixelGridProps {
  id: string;
  width: number;
  height: number;
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

  // When a single cell is changed, receive the change here and update gridState
  function updateState(x: number, y: number, { r, g, b }: CellValue) {
    const newGridState = [...localGridState];
    newGridState[x][y] = { r, g, b };
    setLocalGridState(newGridState);
    setChangeCount(changeCount + 1);

    props.handleChange(x, y, { r, g, b });
  }

  function renderGrid(grid: GridState) {
    return grid.map((column, x) => (
      <div key={x} className='column'>
        {column.map((colour, y) => (
          <PixelCell
            key={`${x}-${y}`}
            colour={colour}
            handleClick={() => updateState(x, y, { r: 1, g: 2, b: 3 })}
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
