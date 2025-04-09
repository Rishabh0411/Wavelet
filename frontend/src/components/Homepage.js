import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router, Route, Routes, Link, Redirect} from "react-router-dom";

export default class Homepage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<p>This is Home page</p>} />
                    <Route path="/create" element={<CreateRoomPage />} />
                    <Route path="/join" element={<RoomJoinPage />} />
                    {/* <Route path="/room/:roomCode" element=http://127.0.0.1:8000/{<Room />} /> */}
                </Routes>
            </Router>
        );
    }
}
