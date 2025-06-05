import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  Fade
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

const pages = {
  JOIN: 'join',
  CREATE: 'create',
};

export default function Info() {
  const [page, setPage] = useState(pages.JOIN);

  const joinInfo = () => '🎧 Join a room to listen to music with others in real-time. Enjoy synced playback, chat, and good vibes!';
  const createInfo = () => '🎶 Create your own music room and take control. Share your taste, host parties, or just chill!';

  useEffect(() => {
    console.log('Info component mounted');
    return () => {
      console.log('Info component unmounted');
    };
  }, []);

  const togglePage = () => {
    setPage((prevPage) => (prevPage === pages.CREATE ? pages.JOIN : pages.CREATE));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
              What is Wavelet?
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Fade in timeout={500}>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                {page === pages.JOIN ? joinInfo() : createInfo()}
              </Typography>
            </Fade>
          </Grid>

          <Grid item xs={12}>
            <IconButton
              onClick={togglePage}
              aria-label="Toggle info page"
              sx={{
                backgroundColor: '#3f51b5',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              {page === pages.JOIN ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
            </IconButton>
          </Grid>

          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/"
              sx={{
                borderRadius: 50,
                paddingX: 4,
                paddingY: 1.2,
                fontWeight: 'bold',
                textTransform: 'none',
                backgroundColor: '#f50057',
                '&:hover': {
                  backgroundColor: '#c51162',
                },
              }}
            >
              ⬅ Back to Home
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
