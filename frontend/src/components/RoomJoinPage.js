import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
    };

    const roomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: roomCode }),
        };

        fetch("/api/join-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    navigate(`/room/${roomCode}`);
                } else {
                    setError("Room not found.");
                }
            });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Join A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={Boolean(error)}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={roomButtonPressed}
                >
                    Join
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/"
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}
