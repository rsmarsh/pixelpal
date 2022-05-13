import React from 'react';

import './PixelCell.scss';

interface CellProps {
  colour: { r: number; g: number; b: number };
  cellX: number;
  cellY: number;
  handleClick: () => void;
}

const PixelCell = (props: CellProps) => {
  return (
    <button
      className='pixel-cell'
      data-cell-x={props.cellX}
      data-cell-y={props.cellY}
      style={{
        backgroundColor: `rgb(${props.colour.r}, ${props.colour.g}, ${props.colour.b})`
      }}
      onPointerDown={props.handleClick}
      onPointerOver={(evt) => {
        evt.pressure > 0 && props.handleClick();
      }}
    ></button>
  );
};

export default PixelCell;
