import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import {
  pageShellSx,
  orbOneSx,
  orbTwoSx,
  glassCardSx,
  titleSx,
  primaryButtonSx,
  outlineButtonSx,
} from "./uiStyles";

export default function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [multiDeviceSync, setMultiDeviceSync] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [participantSyncStatus, setParticipantSyncStatus] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [song, setSong] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    getRoomDetails();
  }, [roomCode]);

  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoomDetails = () => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback?.();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        setMultiDeviceSync(Boolean(data.multi_device_sync));
        if (data.is_host) {
          authenticateSpotify();
          return;
        }
        if (data.multi_device_sync) {
          loadParticipantSyncStatus();
        }
      })
      .catch(() => setError("Failed to fetch room details"));
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((res) => res.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((res) =>
              res.json().then((payload) => ({ ok: res.ok, payload }))
            )
            .then(({ ok, payload }) => {
              if (!ok || !payload?.url) {
                throw new Error(
                  payload?.error || "Spotify credentials are not configured."
                );
              }
              window.location.replace(payload.url);
            });
        }
      })
      .catch((err) => setError(err.message || "Spotify authentication failed"));
  };

  const requestSpotifyAuth = () => {
    fetch("/spotify/get-auth-url")
      .then((res) =>
        res.json().then((payload) => ({ ok: res.ok, payload }))
      )
      .then(({ ok, payload }) => {
        if (!ok || !payload?.url) {
          throw new Error(
            payload?.error || "Spotify credentials are not configured."
          );
        }
        window.location.replace(payload.url);
      })
      .catch((err) => setError(err.message || "Spotify authentication failed"));
  };

  const loadParticipantDevices = () => {
    fetch("/spotify/participant-devices")
      .then((res) => res.json())
      .then((data) => {
        setDevices(data.devices || []);
      })
      .catch(() => setError("Failed to fetch Spotify devices"));
  };

  const loadParticipantSyncStatus = () => {
    fetch("/spotify/participant-sync-status")
      .then((res) => {
        if (!res.ok) {
          throw new Error("sync status failed");
        }
        return res.json();
      })
      .then((data) => {
        setParticipantSyncStatus(data);
        setSelectedDevice(data.selected_device_id || "");
        setSpotifyAuthenticated(Boolean(data.spotify_authenticated));
        if (data.spotify_authenticated) {
          loadParticipantDevices();
        }
      })
      .catch(() => setError("Failed to fetch participant sync status"));
  };

  const handleSelectDevice = (event) => {
    const deviceId = event.target.value;
    setSelectedDevice(deviceId);
    fetch("/spotify/select-device", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: deviceId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("select device failed");
        }
        loadParticipantSyncStatus();
      })
      .catch(() => setError("Failed to set Spotify device"));
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then(async (response) => {
        if ([204, 401, 403, 404].includes(response.status)) {
          return {};
        }
        if (!response.ok) {
          throw new Error("Failed to fetch current song");
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          return {};
        }

        return response.json();
      })
      .then((data) => {
        setSong(data || {});
        setError("");
      })
      .catch(() => setError("Failed to fetch current song"));
  };

  const leaveButtonPressed = () => {
    fetch("/api/leave-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      leaveRoomCallback?.();
      navigate("/");
    });
  };

  if (showSettings) {
    return (
      <CreateRoomPage
        update
        votesToSkip={votesToSkip}
        guestCanPause={guestCanPause}
        multiDeviceSync={multiDeviceSync}
        roomCode={roomCode}
        updateCallback={getRoomDetails}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <Box sx={pageShellSx}>
      <Box sx={orbOneSx} />
      <Box sx={orbTwoSx} />
      <Paper
        elevation={12}
        sx={{
          ...glassCardSx,
          p: 5,
          maxWidth: 680,
          textAlign: "center",
        }}
      >
        <Collapse in={Boolean(error)}>
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        <Typography
          variant="h4"
          sx={{
            ...titleSx,
            mb: 2,
          }}
        >
          Room Code: {roomCode.toUpperCase()}
        </Typography>

        <MusicPlayer {...song} />

        <Collapse in={Boolean(multiDeviceSync && !isHost)}>
          <Box sx={{ mt: 2, textAlign: "left" }}>
            <Alert severity={spotifyAuthenticated ? "info" : "warning"} sx={{ mb: 2 }}>
              {spotifyAuthenticated
                ? "Multi-device sync is enabled. Select your Spotify device to join playback."
                : "Connect Spotify to sync playback on your device."}
            </Alert>

            {!spotifyAuthenticated ? (
              <Button variant="contained" onClick={requestSpotifyAuth} sx={{ ...primaryButtonSx, mb: 2 }}>
                Connect Spotify
              </Button>
            ) : (
              <FormControl fullWidth>
                <InputLabel id="participant-device-label">Playback Device</InputLabel>
                <Select
                  labelId="participant-device-label"
                  label="Playback Device"
                  value={selectedDevice}
                  onChange={handleSelectDevice}
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Collapse in={Boolean(participantSyncStatus?.last_sync_error)}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {participantSyncStatus?.last_sync_error}
              </Alert>
            </Collapse>
          </Box>
        </Collapse>

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          {isHost && (
            <Grid item xs={12} sm="auto">
              <Button
                variant="contained"
                onClick={() => setShowSettings(true)}
                sx={{
                  ...primaryButtonSx,
                  fontSize: "1rem",
                  minWidth: 150,
                }}
              >
                Settings
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
                color="error"
                onClick={leaveButtonPressed}
                sx={{
                  ...outlineButtonSx,
                  fontSize: "0.95rem",
                  minWidth: 170,
                  color: "#fecaca",
                  borderColor: "rgba(252, 165, 165, 0.6)",
                  "&:hover": {
                    backgroundColor: "rgba(239,68,68,0.12)",
                    borderColor: "rgba(252, 165, 165, 0.9)",
                  },
                }}
              >
                ← Leave Room
              </Button>
            </Grid>
          </Grid>
      </Paper>
    </Box>
  );
}
