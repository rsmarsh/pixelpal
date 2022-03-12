import React from 'react';
import ReactDOM from 'react-dom';
import PixelGrid from './components/PixelGrid';

import useWebSocket from './hooks/useWebSocket';

const App = () => {
    const receiveMessage = (label: string, data: any) => {
        console.log("ws message", label, data);
    };

    const [wsConnection, wsSend] = useWebSocket('localhost', {message: receiveMessage, error: console.error});
    return (
        <div>
            <h1>Pixelpal</h1>
            <PixelGrid id="main" width={16} height={16} />
        </div>
    )
};

ReactDOM.render(<App />, document.querySelector('#root'));