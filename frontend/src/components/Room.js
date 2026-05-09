import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Collapse,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import {
  pageShellSx,
  orbOneSx,
  orbTwoSx,
  glassCardSx,
  titleSx,
  primaryButtonSx,
  outlineButtonSx,
} from "./uiStyles";

export default function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    getRoomDetails();
  }, [roomCode]);

  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoomDetails = () => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback?.();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        if (data.is_host) authenticateSpotify();
      })
      .catch(() => setError("Failed to fetch room details"));
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((res) => res.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((res) => res.json())
            .then((data) => window.location.replace(data.url));
        }
      })
      .catch(() => setError("Spotify authentication failed"));
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then(async (response) => {
        if ([204, 401, 403, 404].includes(response.status)) {
          return {};
        }
        if (!response.ok) {
          throw new Error("Failed to fetch current song");
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          return {};
        }

        return response.json();
      })
      .then((data) => {
        setSong(data || {});
        setError("");
      })
      .catch(() => setError("Failed to fetch current song"));
  };

  const leaveButtonPressed = () => {
    fetch("/api/leave-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      leaveRoomCallback?.();
      navigate("/");
    });
  };

  if (showSettings) {
    return (
      <CreateRoomPage
        update
        votesToSkip={votesToSkip}
        guestCanPause={guestCanPause}
        roomCode={roomCode}
        updateCallback={getRoomDetails}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <Box sx={pageShellSx}>
      <Box sx={orbOneSx} />
      <Box sx={orbTwoSx} />
      <Paper
        elevation={12}
        sx={{
          ...glassCardSx,
          p: 5,
          maxWidth: 680,
          textAlign: "center",
        }}
      >
        <Collapse in={Boolean(error)}>
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        <Typography
          variant="h4"
          sx={{
            ...titleSx,
            mb: 2,
          }}
        >
          Room Code: {roomCode.toUpperCase()}
        </Typography>

        <MusicPlayer {...song} />

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          {isHost && (
            <Grid item xs={12} sm="auto">
              <Button
                variant="contained"
                onClick={() => setShowSettings(true)}
                sx={{
                  ...primaryButtonSx,
                  fontSize: "1rem",
                  minWidth: 150,
                }}
              >
                Settings
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
                color="error"
                onClick={leaveButtonPressed}
                sx={{
                  ...outlineButtonSx,
                  fontSize: "0.95rem",
                  minWidth: 170,
                  color: "#fecaca",
                  borderColor: "rgba(252, 165, 165, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(239,68,68,0.12)",
                    borderColor: "rgba(252, 165, 165, 0.9)",
                  },
                }}
              >
                ← Leave Room
              </Button>
            </Grid>
          </Grid>
      </Paper>
    </Box>
  );
}
