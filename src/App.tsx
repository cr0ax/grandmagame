import React from 'react';
import ReactDOM from 'react-dom';
import { VideoPoker } from './videoPoker';

const root = document.getElementById('react-root');
ReactDOM.render(<App />, root);

function App() {
  // const classes = useMainStyles();
  return (
    <VideoPoker />
  );
}

export default App;
