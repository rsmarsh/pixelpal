import React from 'react';

import './PixelCell.scss';

interface CellProps {
  colour: { r: number; g: number; b: number };
  handleClick: () => void;
}

const PixelCell = (props: CellProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <button
      className='pixel-cell'
      style={{
        backgroundColor: `rgb(${props.colour.r}, ${props.colour.g}, ${props.colour.b})`
      }}
      onClick={() => props.handleClick()}
    ></button>
  );
};

export default PixelCell;
