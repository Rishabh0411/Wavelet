import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  Typography,
  Card,
  LinearProgress,
  CardMedia,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

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

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4} display="flex" justifyContent="center">
          <CardMedia
            component="img"
            sx={{ width: 150, height: 150, borderRadius: 2 }}
            image={image_url || "https://via.placeholder.com/150"}
            alt={`${title} album cover`}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Box textAlign="center">
            <Typography variant="h5" noWrap>{title}</Typography>
            <Typography variant="subtitle1" color="text.secondary" noWrap>
              {artist}
            </Typography>3

            <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
              <IconButton onClick={skipSong} aria-label="Previous">
                <SkipPreviousIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={is_playing ? pauseSong : playSong}
                aria-label={is_playing ? "Pause" : "Play"}
              >
                {is_playing ? (
                  <PauseIcon fontSize="large" />
                ) : (
                  <PlayArrowIcon fontSize="large" />
                )}
              </IconButton>
              <IconButton onClick={skipSong} aria-label="Next">
                <SkipNextIcon fontSize="large" />
              </IconButton>
            </Box>

            <Typography variant="caption" display="block" mt={1}>
              Votes to Skip: {votes} / {votes_required}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={songProgress}
              sx={{ mt: 2, height: 10, borderRadius: 5 }}
            />
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
