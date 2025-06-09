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
    fetch("/api/join-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: roomCode }),
    }).then((response) => {
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

      {/* Content */}
      <Fade in={show} timeout={800}>
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: "25px",
            maxWidth: 500,
            width: "100%",
            zIndex: 1,
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.55)",
            boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
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
                variant="h4"
                color="primary"
                sx={{
                  fontWeight: 800,
                  color: "##1976d2",
                  textShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Join a Room
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Room Code"
                value={roomCode}
                onChange={handleTextFieldChange}
                error={Boolean(error)}
                helperText={error}
                sx={{
                  input: {
                    fontWeight: 600,
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#bbb" },
                    "&:hover fieldset": { borderColor: "#764ba2" },
                  },
                  label: { fontWeight: 500, color: "#444" },
                }}
              />
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={roomButtonPressed}
                    sx={{
                      fontWeight: 600,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: "10px",
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        transform: "scale(1.02)",
                        backgroundColor: "#1565c0",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    Join Room
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    component={Link}
                    to="/"
                    variant="outlined"
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
