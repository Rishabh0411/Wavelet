import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Info from "./Info";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";

import {
  Grid,
  Button,
  ButtonGroup,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ roomCode: data.code });
      });
  }

  clearRoomCode() {
    this.setState({ roomCode: null });
  }

  renderHomePage() {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1f1c2c, #928dab)",
          padding: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 5,
            borderRadius: 5,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            maxWidth: 520,
            width: "100%",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Grid
            container
            spacing={5}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "900",
                  color: "#3f51b5",
                  textShadow: "2px 2px 8px rgba(0,0,0,0.15)",
                  letterSpacing: "0.1em",
                }}
              >
                🎵 Wavelet
              </Typography>
            </Grid>

            <Grid item sx={{ width: "100%" }}>
              <ButtonGroup
                orientation="vertical"
                variant="contained"
                fullWidth
                sx={{ gap: 3 }}
              >
                {[
                  { label: "Join a Room", to: "/join", color: "primary" },
                  { label: "Create a Room", to: "/create", color: "secondary" },
                  { label: "Info", to: "/info", color: "info" },
                ].map(({ label, to, color }) => (
                  <Button
                    key={label}
                    color={color}
                    component={Link}
                    to={to}
                    sx={{
                      fontWeight: "700",
                      py: 1.8,
                      fontSize: "1.1rem",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow:
                          "0 6px 12px rgba(63, 81, 181, 0.4), 0 3px 6px rgba(63, 81, 181, 0.3)",
                      },
                    }}
                    aria-label={label}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              this.state.roomCode ? (
                <Navigate to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              )
            }
          />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/info" element={<Info />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route
            path="/room/:roomCode"
            element={<Room leaveRoomCallback={this.clearRoomCode} />}
          />
        </Routes>
      </Router>
    );
  }
}
