import React, { useState, useEffect } from 'react';
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

const pages = {
  JOIN: 'join',
  CREATE: 'create',
};

export default function Info() {
  const [page, setPage] = useState(pages.JOIN);

  const joinInfo = () =>
    '🎧 Join a room to listen to music with others in real-time. Enjoy synced playback, chat, and good vibes!';
  const createInfo = () =>
    '🎶 Create your own music room and take control. Share your taste, host parties, or just chill!';

  useEffect(() => {
    console.log('Info component mounted');
    return () => {
      console.log('Info component unmounted');
    };
  }, []);

  const togglePage = () => {
    setPage((prevPage) =>
      prevPage === pages.CREATE ? pages.JOIN : pages.CREATE
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        overflow: 'hidden',
      }}
    >
      {/* Blob 1 */}
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #a5b4fc, #818cf8)',
          filter: 'blur(100px)',
          top: '-50px',
          left: '-80px',
          zIndex: 0,
        }}
      />

      {/* Blob 2 */}
      <Box
        sx={{
          position: 'absolute',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 70%, #f3e8ff, #d8b4fe)',
          filter: 'blur(100px)',
          bottom: '-60px',
          right: '-60px',
          zIndex: 0,
        }}
      />

      <Paper
        elevation={6}
        sx={{
          zIndex: 1,
          padding: 4,
          borderRadius: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#3f51b5',
              }}
            >
              What is Wavelet?
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Fade in timeout={500}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  color: '#444',
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
                backgroundColor: '#3f51b5',
                color: '#fff',
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
          fullWidth
          variant="outlined"
          component={Link}
          to="/"
          sx={{
            fontWeight: 600,
            fontSize: "0.95rem",
            borderRadius: "10px",
            color: "#555",
            borderColor: "#ccc",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "#aaa",
            },
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
