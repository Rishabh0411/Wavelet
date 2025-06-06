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
  Grow,
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
          background: "linear-gradient(to right, #1c1c1c, #121212)",
          padding: 3,
        }}
      >
        <Grow in timeout={1000}>
          <Paper
            elevation={8}
            sx={{
              padding: 5,
              borderRadius: "20px",
              textAlign: "center",
              backgroundColor: "rgba(33, 33, 33, 0.95)",
              color: "#fff",
              maxWidth: 540,
              width: "100%",
              boxShadow:
                "0 12px 25px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.3s ease",
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
                    color: "#90caf9",
                    textShadow: "3px 3px 10px rgba(0,0,0,0.6)",
                    letterSpacing: "0.1em",
                    userSelect: "none",
                  }}
                >
                  🎵 Wavelet
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 1,
                    color: "#bbb",
                    fontStyle: "italic",
                  }}
                >
                  Music sync, reimagined.
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
                        py: 2,
                        fontSize: "1.1rem",
                        borderRadius: 3,
                        backgroundColor: `${color}.main`,
                        boxShadow: `0 4px 10px rgba(0,0,0,0.3)`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          backgroundColor: `${color}.dark`,
                          boxShadow: `0 6px 16px rgba(0,0,0,0.5)`,
                        },
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Grid>
            </Grid>
          </Paper>
        </Grow>
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
