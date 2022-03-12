import React, { useState} from 'react';

import PixelCell from './PixelCell';
import './PixelGrid.scss';

interface PixelGridProps {
    id: string;
    width: number;
    height: number;
}

type CellValue = {r: number, g: number, b: number};
type GridState = CellValue[][];


const PixelGrid = (props: PixelGridProps) => {

    // The current state of each pixel within the grid
    const [gridState, setGridState] = useState(generateInitialState(props.width, props.height));
    // Number of changes made to this grid
    const [changeCount, setChangeCount] = useState(0);



    // Generates the empty grid object with the provided dimensions
    function generateInitialState(width: number, height: number) {
        const defaultColour = { r: 255, g: 255, b: 255 };
        const gridState: GridState = [];
        

        // iterate across columns on the X axis
        for (let x = 0; x < width; x++) {
            gridState[x] = [];

            // Then iterate through each row within a column
            for (let y = 0; y < height; y++) {
                gridState[x][y] = { ...defaultColour };
            }
        }

        return gridState;
    };

    // When a single cell is changed, receive the change here and update gridState 
    function updateState(x: number, y: number, { r, g, b }: CellValue) {
        console.log("click received");
        console.log(x, y, r,b,g);
        const newGridState = [...gridState ];
        newGridState[x][y] = { r, g, b };
        setGridState(newGridState);

        setChangeCount(changeCount+1);
    };

    function renderGrid(grid: GridState) {
        return grid.map((column, x) => (
            <div key={x} className="column">
                { column.map((colour, y) => <PixelCell key={`${x}-${y}`} colour={colour} handleClick={() => updateState(x, y, {r: 1, g:2, b:3})} />) }
            </div>
        ));
    };


    return (
        <div className="pixel-grid">
            {renderGrid(gridState)}
        </div>
    )

};

export default PixelGrid;
