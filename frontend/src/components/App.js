import React, { Component } from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import Homepage from './Homepage';


export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="center">
                <Homepage />
            </div>
        );
    }
}

const appDiv = document.getElementById("app");
const root = ReactDOM.createRoot(appDiv); // Create a root
root.render(<App />); // Use the new render method
