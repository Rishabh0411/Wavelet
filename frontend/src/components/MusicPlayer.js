import React from "react";
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
}) => {
  const songProgress = (time / duration) * 100;

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4} display="flex" justifyContent="center">
          <CardMedia
            component="img"
            sx={{ width: 150, height: 150, borderRadius: 2 }}
            image={image_url}
            alt="Song cover"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Box textAlign="center">
            <Typography variant="h5">{title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {artist}
            </Typography>

            <Box mt={2}>
              <IconButton>
                <SkipPreviousIcon fontSize="large" />
              </IconButton>
              <IconButton>
                {is_playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>
              <IconButton>
                <SkipNextIcon fontSize="large" />
              </IconButton>
            </Box>

            <LinearProgress
              variant="determinate"
              value={songProgress}
              sx={{ mt: 3, height: 10, borderRadius: 5 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MusicPlayer;
