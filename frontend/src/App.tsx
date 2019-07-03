import React from 'react';
import Homepage from './components/Homepage';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Homepage />
        </header>
      </div>
    </Router>
  );
}

export default App;
