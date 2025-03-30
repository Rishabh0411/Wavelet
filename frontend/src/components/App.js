// import React, { Component } from 'react';
// import {render} from 'react-dom';

// export default class App extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {

//         return <h1>Testing React</h1>;
//     }
// }

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);

import React, { Component } from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client

export default class App extends Component {
    render() {
        return <h1>Testing React</h1>;
    }
}

const appDiv = document.getElementById("app");
const root = ReactDOM.createRoot(appDiv); // Create a root
root.render(<App />); // Use the new render method
