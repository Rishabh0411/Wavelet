import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

    componentDidMount() {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ roomCode: data.code });
            });
    }

    clearRoomCode() {
        this.setState({ roomCode: null });
    }

    renderHomePage() {
        return (
            <Grid
                container
                spacing={3}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "100vh" }}
            >
                <Grid item>
                    <Typography component="h4" variant="h4">
                        Music Controller
                    </Typography>
                </Grid>
                <Grid item>
                    <ButtonGroup variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            this.state.roomCode ? (
                                <Navigate to={`/room/${this.state.roomCode}`} />
                            ) : (
                                this.renderHomePage()
                            )
                        } 
                    />
                    <Route path="/create" element={<CreateRoomPage />} />
                    <Route path="/join" element={<RoomJoinPage />} />
                    <Route 
                        path="/room/:roomCode" 
                        element={<Room leaveRoomCallback={this.clearRoomCode} />} 
                    />
                </Routes>
            </Router>
        );
    }
}