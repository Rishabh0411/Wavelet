import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  Paper,
  keyframes,
  Alert,
  Collapse,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
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
      .then((response) => (response.ok ? response.json() : {}))
      .then((data) => setSong(data))
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

  const renderSettings = () => (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background: `radial-gradient(circle at 30% 20%, rgba(173,216,230,0.4), transparent 50%), 
                     radial-gradient(circle at 70% 80%, rgba(147,112,219,0.3), transparent 60%), 
                     linear-gradient(to bottom right, #e3f2fd, #ede7f6)`,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(98,0,238,0.15)",
          filter: "blur(100px)",
          top: "10%",
          left: "10%",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(33,150,243,0.1)",
          filter: "blur(120px)",
          bottom: "5%",
          right: "5%",
          zIndex: 0,
        }}
      />
      <Paper
        elevation={12}
        sx={{
          p: 5,
          borderRadius: "25px",
          maxWidth: 600,
          width: "100%",
          zIndex: 1,
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.55)",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <CreateRoomPage
          update
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
        <Box mt={3}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  return showSettings ? (
    renderSettings()
  ) : (
    <Box
      sx={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 30% 20%, rgba(173,216,230,0.4), transparent 50%), 
                     radial-gradient(circle at 70% 80%, rgba(147,112,219,0.3), transparent 60%), 
                     linear-gradient(to bottom right, #e3f2fd, #ede7f6)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(98,0,238,0.15)",
          filter: "blur(100px)",
          top: "10%",
          left: "10%",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(33,150,243,0.1)",
          filter: "blur(120px)",
          bottom: "5%",
          right: "5%",
          zIndex: 0,
        }}
      />
      {/* Main Content */}
      <Paper
        elevation={12}
        sx={{
          p: 5,
          borderRadius: "25px",
          maxWidth: 600,
          width: "100%",
          zIndex: 1,
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.55)",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
          animation: `${fadeIn} 0.8s ease-out`,
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
            fontWeight: 800,
            color: "#1976d2",
            textShadow: "0 2px 6px rgba(0,0,0,0.1)",
            fontFamily: "Poppins, sans-serif",
            mb: 2,
          }}
        >
          Room Code: {roomCode}
        </Typography>

        <MusicPlayer {...song} />

        <Grid container spacing={2} sx={{ mt: 4 }}>
          {isHost && (
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowSettings(true)}
                sx={{
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: "10px",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
                }}
              >
                Settings
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={isHost ? 6 : 12}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={leaveButtonPressed}
              sx={{
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "10px",
                color: "#555",
                borderColor: "#ccc",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: "#aaa",
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
