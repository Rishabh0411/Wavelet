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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #2c3e50, #4ca1af)",
        overflow: "hidden",
      }}
    >
      <Fade in={show} timeout={700}>
        <Paper
          elevation={10}
          sx={{
            padding: 5,
            borderRadius: "25px",
            textAlign: "center",
            maxWidth: 500,
            width: "90%",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            boxShadow:
              "0 12px 20px rgba(0,0,0,0.3), inset 0 0 0.5px rgba(255,255,255,0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "transform 0.4s ease",
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
                  fontWeight: "900",
                  color: "#ffffff",
                  textShadow: "1px 1px 8px rgba(0,0,0,0.5)",
                  letterSpacing: "0.07em",
                  userSelect: "none",
                }}
              >
                Join A Room
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <TextField
                error={Boolean(error)}
                label="Room Code"
                placeholder="Enter a Room Code"
                value={roomCode}
                helperText={error}
                variant="filled"
                fullWidth
                onChange={handleTextFieldChange}
                InputProps={{
                  style: {
                    backgroundColor: "rgba(255,255,255,0.85)",
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={roomButtonPressed}
                    sx={{
                      fontWeight: 700,
                      py: 1.8,
                      fontSize: "1.05rem",
                      background: "linear-gradient(45deg, #43cea2, #185a9d)",
                      transition: "0.3s",
                      borderRadius: "15px",
                      "&:hover": {
                        transform: "scale(1.05)",
                        background: "linear-gradient(45deg, #30cfd0, #330867)",
                      },
                    }}
                  >
                    Join
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    to="/"
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#fff",
                      borderColor: "#fff",
                      borderRadius: "15px",
                      textDecoration: "none",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "#ccc",
                      },
                    }}
                  >
                    ← Home
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
