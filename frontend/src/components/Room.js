import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  Paper,
  keyframes,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

// Keyframes for background gradient animation
const gradientAnimation = keyframes`
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
`;

// Fade in animation for Paper components
const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
`;

// Glow animation for buttons
const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px 2px rgba(33, 150, 243, 0.6);
  }
  50% {
    box-shadow: 0 0 16px 6px rgba(33, 150, 243, 1);
  }
`;

// Pulse/wave animation for music player container and update room
const wave = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

export default function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

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
      .catch((error) => console.error("Failed to fetch room details:", error));
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => window.location.replace(data.url));
        }
      })
      .catch((err) => console.error("Spotify auth error:", err));
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => (response.ok ? response.json() : {}))
      .then((data) => setSong(data))
      .catch((err) => console.error("Failed to get current song:", err));
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

  const renderSettings = () => (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      sx={{
        background:
          "linear-gradient(270deg, #232526, #414345, #232526, #414345)",
        backgroundSize: "800% 800%",
        animation: `${gradientAnimation} 20s ease infinite`,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 600,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          animation: `${fadeIn} 0.8s ease forwards`,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(to right, #141E30, #243B55)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Update Room Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modify your room preferences below
          </Typography>
        </Box>

        {/* Add wave animation around CreateRoomPage */}
        <Box
          sx={{
            borderRadius: 3,
            animation: `${wave} 2.5s infinite`,
            boxShadow: "0 0 20px 4px rgba(33, 150, 243, 0.7)",
            p: 2,
          }}
        >
          <CreateRoomPage
            update
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={() => {
              getRoomDetails();
              setShowSettings(false);
            }}
          />
        </Box>

        <Grid container justifyContent="center" mt={3}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowSettings(false)}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  boxShadow: "0 0 12px 3px rgba(211,47,47,0.8)",
                },
              }}
            >
              Close Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  if (showSettings) return renderSettings();

  return (
    <Box
      minHeight="100vh"
      px={2}
      py={4}
      sx={{
        background:
          "linear-gradient(270deg, #141E30, #243B55, #141E30, #243B55)",
        backgroundSize: "800% 800%",
        animation: `${gradientAnimation} 30s ease infinite`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          textAlign: "center",
          animation: `${fadeIn} 1s ease forwards`,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          sx={{
            mb: 3,
            color: "#141E30",
            textShadow: "0 0 5px rgba(33, 150, 243, 0.8)",
            letterSpacing: 2,
            userSelect: "none",
          }}
        >
          Room Code: {roomCode}
        </Typography>

        {/* Wave animation around MusicPlayer */}
        <Box
          my={3}
          sx={{
            borderRadius: 4,
            p: 2,
            position: "relative",
            animation: `${wave} 2.5s infinite`,
            boxShadow: "0 0 20px 4px rgba(33, 150, 243, 0.7)",
            transition: "all 0.5s ease",
          }}
        >
          <MusicPlayer {...song} />
        </Box>

        {isHost && (
          <Box my={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setShowSettings(true)}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: 3,
                animation: `${glow} 3s ease-in-out infinite`,
                boxShadow: "0 0 12px rgba(33, 150, 243, 0.7)",
                "&:hover": {
                  boxShadow:
                    "0 0 24px 8px rgba(33, 150, 243, 1), 0 0 8px 2px rgba(33,150,243,0.9)",
                },
              }}
            >
              Room Settings
            </Button>
          </Box>
        )}

        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              py: 1.2,
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#c51162",
                boxShadow: "0 0 15px 5px rgba(197,17,98,0.8)",
              },
            }}
          >
            Leave Room
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
