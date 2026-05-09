import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  Typography,
  Card,
  CardMedia,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { motion } from "framer-motion";

const LOCAL_FALLBACK_COVER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='100%25' height='100%25' fill='%23eceff1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23607075' font-family='Arial' font-size='14'>No Cover</text></svg>";

const formatTime = (ms = 0) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const MusicPlayer = ({
  title = "Unknown Title",
  artist = "Unknown Artist",
  image_url = "",
  is_playing = false,
  time = 0,
  duration = 1,
  votes = 0,
  votes_required = 0,
}) => {
  const handleFetch = async (url, method) => {
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(`Failed to ${method} ${url}:`, error);
    }
  };

  const skipSong = () => handleFetch("/spotify/skip", "POST");
  const pauseSong = () => handleFetch("/spotify/pause", "PUT");
  const playSong = () => handleFetch("/spotify/play", "PUT");

  const songProgress = Math.min((time / duration) * 100, 100);
  const safeProgress = Number.isFinite(songProgress) ? Math.max(songProgress, 0) : 0;
  const currentTimeLabel = formatTime(time);
  const totalTimeLabel = formatTime(duration);
  const motionTransition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      sx={{
        maxWidth: 700,
        mx: "auto",
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 5,
        border: "1px solid var(--wave-player-border)",
        boxShadow: "var(--wave-player-shadow)",
        background: "var(--wave-player-bg)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4} display="flex" justifyContent="center">
          <Box sx={{ position: "relative" }}>
            <Box
              component={motion.div}
              animate={
                is_playing
                  ? { scale: [1, 1.02, 1] }
                  : { scale: 1 }
              }
              transition={
                is_playing
                  ? {
                      scale: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
                    }
                  : { duration: 0.3 }
              }
              sx={{ borderRadius: 4, overflow: "hidden" }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: 168,
                  height: 168,
                  borderRadius: 4,
                  border: "1px solid var(--wave-player-cover-border)",
                }}
                image={image_url || LOCAL_FALLBACK_COVER}
                alt={`${title} album cover`}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box textAlign="center">
            <Typography
              variant="h4"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: "0.01em",
                fontSize: { xs: "1.55rem", md: "2rem" },
                color: "var(--wave-text-primary)",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              noWrap
              sx={{ color: "var(--wave-text-secondary)", mt: 0.4 }}
            >
              {artist}
            </Typography>
            <Box
              component={motion.div}
              animate={is_playing ? { y: [0, -1, 0] } : { y: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Chip
                label={is_playing ? "Now Playing" : "Paused"}
                size="small"
                sx={{
                  mt: 1.5,
                  backgroundColor: is_playing
                    ? "var(--wave-player-chip-play-bg)"
                    : "var(--wave-player-chip-pause-bg)",
                  color: is_playing
                    ? "var(--wave-player-chip-play-text)"
                    : "var(--wave-player-chip-pause-text)",
                  border: "1px solid var(--wave-player-chip-border)",
                }}
              />
            </Box>

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ mt: 2.3 }}
            >
              <Box component={motion.div} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={skipSong}
                  aria-label="Previous"
                  sx={{
                    color: "var(--wave-player-control-text)",
                    backgroundColor: "var(--wave-player-control-bg)",
                    width: 52,
                    height: 52,
                  }}
                >
                  <SkipPreviousIcon fontSize="large" />
                </IconButton>
              </Box>

              <Box sx={{ position: "relative" }}>
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={motionTransition}
                >
                  <IconButton
                    onClick={is_playing ? pauseSong : playSong}
                    aria-label={is_playing ? "Pause" : "Play"}
                    sx={{
                      color: "#fff",
                      width: 62,
                      height: 62,
                      background: "var(--wave-accent-gradient)",
                      boxShadow: "var(--wave-accent-shadow)",
                      "&:hover": {
                        background: "var(--wave-accent-gradient-hover)",
                      },
                    }}
                  >
                    {is_playing ? (
                      <PauseIcon fontSize="large" />
                    ) : (
                      <PlayArrowIcon fontSize="large" />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Box component={motion.div} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={skipSong}
                  aria-label="Next"
                  sx={{
                    color: "var(--wave-player-control-text)",
                    backgroundColor: "var(--wave-player-control-bg)",
                    width: 52,
                    height: 52,
                  }}
                >
                  <SkipNextIcon fontSize="large" />
                </IconButton>
              </Box>
            </Stack>

            <Typography
              variant="caption"
              display="block"
              mt={1.7}
              sx={{ color: "var(--wave-text-secondary)", fontSize: "0.78rem" }}
            >
              Votes to Skip: {votes} / {votes_required}
            </Typography>

            <Box sx={{ mt: 1.8, mx: "auto", width: "100%", maxWidth: 390 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.7 }}>
                <Typography variant="caption" sx={{ color: "var(--wave-text-secondary)" }}>
                  {currentTimeLabel}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--wave-text-secondary)" }}>
                  {totalTimeLabel}
                </Typography>
              </Stack>

              <Box
                sx={{
                  height: 12,
                  borderRadius: 99,
                  backgroundColor: "var(--wave-player-track-bg)",
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid var(--wave-player-track-border)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(to right, var(--wave-player-track-tick) 0, var(--wave-player-track-tick) 1px, transparent 1px, transparent 18px)",
                    opacity: 0.35,
                  }}
                />

                <Box
                  component={motion.div}
                  animate={{ width: `${safeProgress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  sx={{
                    height: "100%",
                    borderRadius: 99,
                    background: "var(--wave-accent-gradient)",
                    position: "relative",
                    zIndex: 1,
                  }}
                />

              </Box>

            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

MusicPlayer.propTypes = {
  title: PropTypes.string,
  artist: PropTypes.string,
  image_url: PropTypes.string,
  is_playing: PropTypes.bool,
  time: PropTypes.number,
  duration: PropTypes.number,
  votes: PropTypes.number,
  votes_required: PropTypes.number,
};

export default MusicPlayer;
