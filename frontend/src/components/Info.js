import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  Fade,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import {
  pageShellSx,
  orbOneSx,
  orbTwoSx,
  glassCardSx,
  titleSx,
  subtitleSx,
  outlineButtonSx,
} from "./uiStyles";

const pages = {
  JOIN: 'join',
  CREATE: 'create',
};

export default function Info() {
  const [page, setPage] = useState(pages.JOIN);

  const joinInfo = () =>
    'Jump into a room and enjoy synced playback with your crew. Everyone stays on the same beat while voting to skip.';
  const createInfo = () =>
    'Create your own room, connect Spotify as host, and set playback permissions with vote rules for a smooth shared session.';

  const togglePage = () => {
    setPage((prevPage) =>
      prevPage === pages.CREATE ? pages.JOIN : pages.CREATE
    );
  };

  return (
    <Box
      sx={pageShellSx}
    >
      <Box sx={orbOneSx} />
      <Box sx={orbTwoSx} />

      <Paper
        elevation={6}
        sx={{
          ...glassCardSx,
          p: 4,
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{
                ...titleSx,
              }}
            >
              About Wavelet
            </Typography>
            <Typography variant="body2" sx={{ ...subtitleSx, mt: 1 }}>
              Built for collaborative listening with a music-first experience.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Fade in timeout={500}>
              <Typography
                variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    color: 'rgba(229, 231, 235, 0.88)',
                    lineHeight: 1.6,
                  }}
                >
                {page === pages.JOIN ? joinInfo() : createInfo()}
              </Typography>
            </Fade>
          </Grid>

          <Grid item xs={12}>
            <IconButton
              onClick={togglePage}
              aria-label="Toggle info page"
              sx={{
                background:
                  'linear-gradient(90deg, rgba(255,77,166,0.95) 0%, rgba(124,77,255,0.95) 100%)',
                color: '#fff',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, rgba(255,45,149,1) 0%, rgba(111,60,255,1) 100%)',
                },
              }}
            >
              {page === pages.JOIN ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
            </IconButton>
          </Grid>

          <Grid item xs={12}>
          <Button
          fullWidth
          variant="outlined"
          component={Link}
           to="/"
           sx={{
            ...outlineButtonSx,
           }}
         >
           ← Back to Home
        </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
