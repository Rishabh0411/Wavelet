import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './Homepage';

export default class App extends Component {
  render() {
    return (
      <div className="center">
        <Homepage />
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
const root = ReactDOM.createRoot(appDiv);
root.render(<App />);
