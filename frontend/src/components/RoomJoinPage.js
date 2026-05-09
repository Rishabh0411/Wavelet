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
import {
  pageShellSx,
  orbOneSx,
  orbTwoSx,
  glassCardSx,
  titleSx,
  subtitleSx,
  primaryButtonSx,
  outlineButtonSx,
  subtleTextFieldSx,
} from "./uiStyles";

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
    <Box sx={pageShellSx}>
      <Box sx={orbOneSx} />
      <Box sx={orbTwoSx} />

      {/* Content */}
      <Fade in={show} timeout={800}>
        <Paper
          elevation={12}
          sx={{
            ...glassCardSx,
            p: 5,
            maxWidth: 500,
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
                sx={{
                  ...titleSx,
                }}
              >
                Join the Session
              </Typography>
              <Typography variant="body2" sx={{ ...subtitleSx, mt: 1 }}>
                Enter a room code and start listening together.
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
                  ...subtleTextFieldSx,
                  "& .MuiOutlinedInput-input": {
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm="auto">
                  <Button
                    variant="contained"
                    onClick={roomButtonPressed}
                    sx={{
                      ...primaryButtonSx,
                      fontSize: "1rem",
                      minWidth: 160,
                    }}
                  >
                    Join Room
                  </Button>
                </Grid>

                <Grid item xs={12} sm="auto">
                  <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    sx={{
                      ...outlineButtonSx,
                      minWidth: 160,
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
