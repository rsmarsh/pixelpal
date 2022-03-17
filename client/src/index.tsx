import React from 'react';
import ReactDOM from 'react-dom';
import DrawGrid from 'Components/DrawGrid/DrawGrid';

import './App.scss';

const App = () => {
  return (
    <div className='app'>
      <header>
        <h1>Pixelpal</h1>
      </header>
      <main>
        <div className='active-grid'>
          <DrawGrid />
        </div>
      </main>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
