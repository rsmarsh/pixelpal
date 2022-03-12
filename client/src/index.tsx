import React from 'react';
import ReactDOM from 'react-dom';
import PixelGrid from './components/PixelGrid';

const App = () => {
    return (
        <div>
            <h1>Pixelpal</h1>
            <PixelGrid id="main" width={16} height={16} />
        </div>
    )
};

ReactDOM.render(<App />, document.querySelector('#root'));