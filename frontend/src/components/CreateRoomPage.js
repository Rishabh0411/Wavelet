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
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="contained"
          color={update ? "secondary" : "primary"}
          onClick={update ? handleUpdateButtonPressed : handleRoomButtonPressed}
          disabled={votesToSkipState < 1}
          sx={{
            fontWeight: "700",
            fontSize: "1.1rem",
            py: 1.8,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow:
                "0 6px 12px rgba(63, 81, 181, 0.4), 0 3px 6px rgba(63, 81, 181, 0.3)",
            },
          }}
        >
          {update ? "Update Room" : "Create Room"}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="text"
          color="secondary"
          component={Link}
          to="/"
          sx={{
            mt: 2,
            fontWeight: "600",
            fontSize: "0.95rem",
            textDecoration: "underline",
            "&:hover": { color: "#3f51b5" },
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f1c2c",
        backgroundImage: `
          repeating-radial-gradient(
            circle at center,
            rgba(101, 114, 240, 0.3) 0px,
            rgba(101, 114, 240, 0.3) 4px,
            transparent 5px,
            transparent 20px
          )
        `,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
        animation: "moveBackground 8s linear infinite",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes moveBackground {
            0% { background-position: center 0px; }
            100% { background-position: center 1000px; }
          }
        `}
      </style>

      <Fade in={show} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            position: "relative",
            padding: 5,
            borderRadius: 5,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            maxWidth: 520,
            width: "100%",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)",
            zIndex: 1,
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
                component="h1"
                sx={{
                  fontWeight: "900",
                  color: "#3f51b5",
                  textShadow: "2px 2px 8px rgba(0,0,0,0.15)",
                  letterSpacing: "0.1em",
                  userSelect: "none",
                }}
              >
                {update ? "Update Room" : "Create Room"}
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <FormControl component="fieldset" fullWidth>
                <FormHelperText>
                  <Typography
                    align="center"
                    variant="body2"
                    color="text.secondary"
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
                    control={<Radio color="primary" />}
                    label="Play/Pause"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio color="secondary" />}
                    label="No Control"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <TextField
                  required
                  type="number"
                  value={votesToSkipState}
                  onChange={handleVotesChange}
                  inputProps={{ min: 1 }}
                  label="Votes To Skip"
                  variant="outlined"
                />
                <FormHelperText>
                  <Typography
                    align="center"
                    variant="body2"
                    color="text.secondary"
                  >
                    Number of votes required to skip a song
                  </Typography>
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              {renderButtons()}
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Box>
  );
}
