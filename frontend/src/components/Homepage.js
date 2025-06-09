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
        {/* Decorative Blobs */}
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

        <Grow in timeout={800}>
          <Paper
            elevation={6}
            sx={{
              padding: 5,
              borderRadius: "24px",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(12px)",
              color: "#333",
              maxWidth: 520,
              width: "100%",
              zIndex: 1,
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
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
                    color: "#1976d2",
                    letterSpacing: "0.04em",
                    userSelect: "none",
                  }}
                >
                  🎵 Wavelet
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 1,
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  Music sync, reimagined.
                </Typography>
              </Grid>

              <Grid item sx={{ width: "100%" }}>
                <Grid container spacing={3} direction="column">
                  {[
                    {
                      label: "Join a Room",
                      to: "/join",
                      style: {
                        color: "#fff",
                        backgroundColor: "#00bcd4",
                        "&:hover": { backgroundColor: "#0097a7" },
                      },
                    },
                    {
                      label: "Create a Room",
                      to: "/create",
                      style: {
                        color: "#fff",
                        backgroundColor: "#6a1b9a",
                        "&:hover": { backgroundColor: "#4a148c" },
                      },
                    },
                    {
                      label: "Info",
                      to: "/info",
                      style: {
                        color: "#fff",
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#115293" },
                      },
                    },
                  ].map(({ label, to, style }) => (
                    <Grid item key={label}>
                      <Button
                        component={Link}
                        to={to}
                        fullWidth
                        sx={{
                          fontWeight: "700",
                          py: 1.8,
                          fontSize: "1.05rem",
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          textTransform: "none",
                          ...style,
                          "&:hover": {
                            transform: "scale(1.05)",
                            ...style["&:hover"],
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
