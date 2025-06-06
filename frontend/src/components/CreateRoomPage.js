import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
  Paper,
  Box,
  Fade,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

export default function CreateRoomPage(props) {
  const {
    votesToSkip = 2,
    guestCanPause = true,
    update = false,
    roomCode = null,
    updateCallback = () => {},
  } = props;

  const [guestCanPauseState, setGuestCanPause] = useState(guestCanPause);
  const [votesToSkipState, setVotesToSkip] = useState(votesToSkip);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const handleVotesChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1) return;
    setVotesToSkip(value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        navigate("/room/" + data.code);
      });
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
        code: roomCode,
      }),
    };

    fetch("/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          setSuccessMessage("Room updated successfully!");
          setErrorMessage("");
          setTimeout(() => updateCallback(), 800);
        } else {
          setErrorMessage("Error updating room...");
          setSuccessMessage("");
        }
      })
      .catch(() => {
        setErrorMessage("Network error occurred.");
        setSuccessMessage("");
      });
  };

  const renderButtons = () => (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Button
          fullWidth
          variant="contained"
          color={update ? "secondary" : "primary"}
          onClick={update ? handleUpdateButtonPressed : handleRoomButtonPressed}
          disabled={votesToSkipState < 1}
          sx={{
            fontWeight: "bold",
            fontSize: "1.05rem",
            py: 1.5,
            background: update
              ? "linear-gradient(45deg, #ff4e50, #f9d423)"
              : "linear-gradient(45deg, #43cea2, #185a9d)",
            borderRadius: "12px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              background: update
                ? "linear-gradient(45deg, #f12711, #f5af19)"
                : "linear-gradient(45deg, #30cfd0, #330867)",
            },
          }}
        >
          {update ? "Update Room" : "Create Room"}
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
  );

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
            maxWidth: 540,
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
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Collapse in={Boolean(successMessage || errorMessage)}>
                {successMessage && (
                  <Alert
                    severity="success"
                    onClose={() => setSuccessMessage("")}
                    sx={{ mb: 2 }}
                  >
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert
                    severity="error"
                    onClose={() => setErrorMessage("")}
                    sx={{ mb: 2 }}
                  >
                    {errorMessage}
                  </Alert>
                )}
              </Collapse>
            </Grid>

            <Grid item>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#fff",
                  textShadow: "1px 1px 10px rgba(0,0,0,0.4)",
                  letterSpacing: "0.08em",
                  userSelect: "none",
                }}
              >
                {update ? "Update Room" : "Create Room"}
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <FormHelperText>
                  <Typography
                    align="center"
                    variant="body2"
                    color="white"
                    sx={{ opacity: 0.8 }}
                  >
                    Guest Control of Playback State
                  </Typography>
                </FormHelperText>
                <RadioGroup
                  row
                  value={guestCanPauseState.toString()}
                  onChange={handleGuestCanPauseChange}
                  sx={{ justifyContent: "center", mt: 1 }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio sx={{ color: "#43cea2" }} />}
                    label="Play/Pause"
                    sx={{ color: "white" }}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio sx={{ color: "#ff4e50" }} />}
                    label="No Control"
                    sx={{ color: "white" }}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <Typography
                  sx={{ mb: 1, color: "#ccc", fontSize: "0.9rem" }}
                >
                  Votes To Skip
                </Typography>
                <TextField
                  required
                  type="number"
                  value={votesToSkipState}
                  onChange={handleVotesChange}
                  inputProps={{ min: 1 }}
                  variant="outlined"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    input: { color: "#fff", fontWeight: 600 },
                    label: { color: "#ccc" },
                  }}
                />
                <FormHelperText>
                  <Typography
                    align="center"
                    variant="body2"
                    sx={{ mb: 1, color: "#ccc", fontSize: "0.9rem" }}
                  >
                    Number of votes required to skip a song
                  </Typography>
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item sx={{ width: "100%" }}>{renderButtons()}</Grid>
          </Grid>
        </Paper>
      </Fade>
    </Box>
  );
}
