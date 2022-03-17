import React from 'react';
import './ColourPicker.scss';

import { hexToRgb, rgbToHex } from 'Utils/colour';

type Colour = { r: number; g: number; b: number };

interface ColourPickerProps {
  initialColour: Colour;
  handleChange: (newColour: Colour) => void;
}

const ColourPicker = (props: ColourPickerProps) => {
  const handleColourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // colour inputs only hold a string hex value
    const rgbColour = hexToRgb(event.target.value);
    props.handleChange(rgbColour);
  };

  return (
    <div className='colour-picker'>
      <label>
        <input
          type='color'
          defaultValue={rgbToHex(props.initialColour)}
          onChange={handleColourChange}
        />
      </label>
    </div>
  );
};

export default ColourPicker;
