import React from 'react';

import './PixelCell.scss';

interface CellProps {
  colour: { r: number; g: number; b: number };
  handleClick: () => void;
}

const PixelCell = (props: CellProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className='pixel-cell'
      style={{
        backgroundColor: `rgb(${props.colour.r}, ${props.colour.g}, ${props.colour.b})`
      }}
      role='button'
      onClick={() => props.handleClick()}
      tabIndex={0}
    >
      X
    </div>
  );
};

export default PixelCell;
