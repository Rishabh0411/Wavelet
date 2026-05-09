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
  Typography,
  Box,
  Paper,
  Grow,
} from "@mui/material";
import {
  pageShellSx,
  orbOneSx,
  orbTwoSx,
  glassCardSx,
  titleSx,
  subtitleSx,
} from "./uiStyles";

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
    const actions = [
      { label: "Join a Room", to: "/join" },
      { label: "Create a Room", to: "/create" },
      { label: "How It Works", to: "/info" },
    ];

    return (
      <Box sx={pageShellSx}>
        <Box sx={orbOneSx} />
        <Box sx={orbTwoSx} />

        <Grow in timeout={800}>
          <Paper
            elevation={6}
            sx={{
              ...glassCardSx,
              p: 5,
              textAlign: "center",
              maxWidth: 520,
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
                    ...titleSx,
                    fontWeight: 900,
                    userSelect: "none",
                  }}
                >
                  🎵 Wavelet
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    ...subtitleSx,
                    mt: 1,
                    fontStyle: "italic",
                  }}
                >
                  Music sync, reimagined.
                </Typography>
              </Grid>

              <Grid item sx={{ width: "100%" }}>
                <Grid container spacing={3} direction="column">
                  {actions.map(({ label, to }) => (
                    <Grid item key={label}>
                      <Button
                        component={Link}
                        to={to}
                        fullWidth
                        variant="outlined"
                        sx={{
                          py: 1.8,
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          borderRadius: "12px",
                          color: "var(--wave-outline-text)",
                          borderColor: "var(--wave-outline-border)",
                          backgroundColor: "var(--wave-outline-bg)",
                          transition: "all 0.24s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            color: "#fff",
                            borderColor: "transparent",
                            background: "var(--wave-accent-gradient)",
                            boxShadow: "var(--wave-accent-shadow-hover)",
                          },
                        }}
                      >
                        {label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
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
