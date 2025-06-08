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
  Grow,
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
            fontWeight: 600,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
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
            borderRadius: "8px",
            color: "#555",
            borderColor: "#ccc",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.03)",
              borderColor: "#aaa",
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
        background: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Grow in={show} timeout={800}>
        <Paper
          elevation={3}
          sx={{
            padding: 5,
            borderRadius: "24px",
            textAlign: "center",
            backgroundColor: "#fff",
            color: "#333",
            maxWidth: 520,
            width: "100%",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
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
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#1976d2",
                  letterSpacing: "0.05em",
                  userSelect: "none",
                }}
              >
                {update ? "Update Room" : "Create a Room"}
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <FormControl fullWidth>
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
                <Typography
                  sx={{ mb: 1, fontSize: "0.9rem", fontWeight: 500 }}
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

            <Grid item sx={{ width: "100%" }}>{renderButtons()}</Grid>
          </Grid>
        </Paper>
      </Grow>
    </Box>
  );
}
