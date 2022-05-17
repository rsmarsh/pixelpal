import React, { useEffect, useState } from 'react';
import EyeDropperIcon from 'Assets/icons/eyedropper.svg';
import './ColourPicker.scss';

import { hexToRgb, rgbToHex } from 'Utils/colour';

type Colour = { r: number; g: number; b: number };

interface ColourPickerProps {
  activeColour: Colour;
  handleChange: (newColour: Colour) => void;
  eyeDropperActive: boolean;
  setEyeDropperActive: (active: boolean) => void;
}

const ColourPicker = (props: ColourPickerProps) => {
  const blankColour: Colour = { r: 255, g: 255, b: 255 };

  const [activeColour, setActiveColour] = useState(props.activeColour);

  useEffect(() => {
    setActiveColour(props.activeColour);

    // if the active colour is changing when the eye dropper is on, add the sampled colour to the recents
    if (props.eyeDropperActive) {
      setColourHistory((history) => [props.activeColour, ...history]);
    }
  }, [props.activeColour]);

  // how many tiles to show in the lists of recents/favourites
  const TILE_COUNT = 5;

  // default the lists to have blank colour entries, so thay are all rendered & filled from the start
  const initialHistory = [activeColour];
  initialHistory.length = TILE_COUNT;
  initialHistory.fill(blankColour, 1, TILE_COUNT);
  const [colourHistory, setColourHistory] = useState<Colour[]>(initialHistory);

  const initialFavourites: Colour[] = [];
  initialFavourites.length = TILE_COUNT;
  initialFavourites.fill(blankColour, 0, TILE_COUNT);
  const [favouriteColours, setFavouriteColours] = useState<Colour[]>(initialFavourites);

  // const [coveredUpColours, setCoveredUpColours] = useState<Colour[]>([]);

  const handleColourChange = (hexColour: string, updateRecents: boolean) => {
    // colour picker inputs only hold a string hex value
    const rgbColour = hexToRgb(hexColour);
    setActiveColour(rgbColour);

    // not wanted if this change is from the recent list already
    if (updateRecents) {
      setColourHistory((history) => [rgbColour, ...history]);
    }

    props.handleChange(rgbColour);
  };

  // May become a seperate component if the colour grid can also make use of this
  const renderPickerTile = (colour: Colour, clickUpdatesRecents: boolean) => {
    const hexColour = rgbToHex(colour);

    return (
      <div>
        <button
          className='picker-tile'
          onClick={() => handleColourChange(hexColour, clickUpdatesRecents)}
          style={{ backgroundColor: hexColour }}
        ></button>
      </div>
    );
  };

  const toggleEyeDropperMode = () => {
    props.setEyeDropperActive(!props.eyeDropperActive);
  };

  return (
    <div>
      {/* Eye dropper mode toggle */}
      <div className={`eye-dropper ${props.eyeDropperActive ? 'mode-active' : ''}`}>
        <button onClick={toggleEyeDropperMode}>
          <EyeDropperIcon />
        </button>
      </div>

      <div className='colour-picker-area'>
        {/* Recently used colours */}
        <div className='picker-list'>
          <span role='img' className='picker-icon recents'>
            ⏲
          </span>
          <div className='button-row'>
            {colourHistory
              .slice(0, TILE_COUNT)
              .reverse() //reverse so that it nicely flows right-to-left visually
              .map((colour) => renderPickerTile(colour, false))}
          </div>
        </div>

        {/* Colour picker */}
        <label>
          <input
            type='color'
            value={rgbToHex(activeColour)}
            onChange={(e) => handleColourChange(e.target.value, true)}
          />
        </label>

        {/* Favourited colours */}
        <div className='picker-list'>
          {/* when clicked, adds the currently active colour to the start of the favourites array */}
          <button
            onClick={() => setFavouriteColours([activeColour, ...favouriteColours])}
            className='picker-icon'
          >
            <span role='img'>⭐</span>
          </button>
          <div className='button-row'>
            {favouriteColours
              .slice(0, TILE_COUNT)
              .map((colour) => renderPickerTile(colour, true))}
          </div>
        </div>

        {/* Recently 'covered up' colours
        <div className='picker-list'>
        <span role='img'>🤦‍♂️</span>
        TBD, will have to be passed in as props after a refactor
        </div> 
      */}
      </div>
    </div>
  );
};

export default ColourPicker;
