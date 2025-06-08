import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Fade,
  Alert,
  Collapse,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  const roomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: roomCode }),
    };

    fetch("/api/join-room", requestOptions).then((response) => {
      if (response.ok) {
        navigate(`/room/${roomCode}`);
      } else {
        setError("Room not found.");
      }
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #2c3e50, #4ca1af)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in={show} timeout={800}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: "25px",
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "0 15px 30px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.3)",
          }}
        >
          <Grid
            container
            spacing={4}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item sx={{ width: "100%" }}>
              <Collapse in={Boolean(error)}>
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  sx={{ mb: 2 }}
                >
                  {error}
                </Alert>
              </Collapse>
            </Grid>

            <Grid item>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#fff",
                  textShadow: "1px 1px 10px rgba(0,0,0,0.4)",
                  letterSpacing: "0.08em",
                  userSelect: "none",
                }}
              >
                Join a Room
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <TextField
                required
                label="Room Code"
                placeholder="Enter Room Code"
                variant="outlined"
                fullWidth
                value={roomCode}
                onChange={handleTextFieldChange}
                error={Boolean(error)}
                helperText={error}
                sx={{
                  input: { color: "#fff", fontWeight: 600 },
                  label: { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    "& fieldset": {
                      borderColor: "#bbb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={roomButtonPressed}
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      py: 1.5,
                      background: "linear-gradient(45deg, #43cea2, #185a9d)",
                      borderRadius: "12px",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        background: "linear-gradient(45deg, #30cfd0, #330867)",
                      },
                    }}
                  >
                    Join Room
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to="/"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderRadius: "12px",
                      color: "#ffffff",
                      borderColor: "#ffffff",
                      mt: { xs: 2, sm: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "#ddd",
                        color: "#ddd",
                      },
                    }}
                  >
                    ← Back to Home
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Box>
  );
}
