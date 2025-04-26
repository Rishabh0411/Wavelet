import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

export default function Room(props) {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    if (props.leaveRoomCallback) props.leaveRoomCallback();
                    navigate("/");
                }
                return response.json();
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            })
            .catch((error) => {
                console.error("Error fetching room details:", error);
            });
    }, [roomCode, navigate, props]);

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
            if (props.leaveRoomCallback) props.leaveRoomCallback();
            navigate("/");
        });
    };

    const renderSettings = () => {
        return (
            <Grid
                container
                spacing={1}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "100vh" }}
            >
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallback={() => setShowSettings(false)}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => setShowSettings(false)}
                        style={{ marginTop: "20px" }}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderSettingsButton = () => {
        return (
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => setShowSettings(true)}
                >
                    Settings
                </Button>
            </Grid>
        );
    };

    if (showSettings) {
        return renderSettings();
    }

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
                    Room Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item>
                <Typography component="h5" variant="h5">
                    Votes Required To Skip: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item>
                <Typography component="h5" variant="h5">
                    Guest Can Pause Playback: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item>
                <Typography component="h5" variant="h5">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={leaveButtonPressed}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
}