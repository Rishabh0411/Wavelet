import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

const pages = {
  JOIN: "join",
  CREATE: "create",
};

export default function Info() {
  const [page, setPage] = useState(pages.JOIN);

  const joinInfo = () => "Join a room to listen to music with others.";
  const createInfo = () => "Create a room and control the playback.";

  useEffect(() => {
    console.log("Info component mounted");
    return () => {
      console.log("Info component unmounted");
    };
  }, []);

  const togglePage = () => {
    setPage((prevPage) =>
      prevPage === pages.CREATE ? pages.JOIN : pages.CREATE
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align="center">
        <Typography variant="h5" component="h2">
          What is Wavelet?
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <IconButton onClick={togglePage} aria-label="Toggle info page">
          {page === pages.JOIN ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
        </IconButton>
      </Grid>

      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          component={Link}
          to="/"
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
