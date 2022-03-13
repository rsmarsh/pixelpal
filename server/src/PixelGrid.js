// Class to manage the current state of a pixel grid.
// Also contains functions to update the pixel grid as changes are made.
class PixelGrid {
    constructor(id, width, height) {
        this.id = id;
        this.width = width;
        this.height = height;

        // The current state of each pixel within the grid
        this.state = this.generateInitialState(width, height);

        // Number of changes made to this grid
        this.changeCount = 0;


    };

    // Generates the empty grid object with the provided dimensions
    generateInitialState = (width, height) => {
        const defaultColour = { r: 255, g: 255, b: 255 };
        const gridState = [];

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

    updateState(x, y, { r, g, b }) {
        this.state[x][y] = { r, g, b };
        this.changeCount += 1;
    };

};

export default PixelGrid;
