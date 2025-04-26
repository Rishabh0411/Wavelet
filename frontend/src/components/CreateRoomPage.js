import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";

export default function CreateRoomPage(props) {
    const {
        votesToSkip = 2,
        guestCanPause = true,
        update = false,
        roomCode = null,
        updateCallback = () => {},
    } = props;

    const [guestCanPauseState, setGuestCanPause] = useState(guestCanPause);
    const [votesToSkipState, setVotesToSkip] = useState(votesToSkip);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleVotesChange = (e) => {
        setVotesToSkip(Number(e.target.value));
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true");
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkipState,
                guest_can_pause: guestCanPauseState,
            }),
        };

        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("Room created with code:", data.code);
                navigate("/room/" + data.code);
            });
    };

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkipState,
                guest_can_pause: guestCanPauseState,
                code: roomCode,
            }),
        };

        fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    setSuccessMessage("Room updated successfully!");
                    setErrorMessage("");

                    setTimeout(() => {
                        updateCallback();
                    }, 800);
                } else {
                    setErrorMessage("Error updating room...");
                    setSuccessMessage("");
                }
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("Network error occurred.");
                setSuccessMessage("");
            });
    };

    const renderCreateButtons = () => (
        <Grid container spacing={1}>
            <Grid item>
                <Button color="secondary" variant="contained" onClick={handleRoomButtonPressed}>
                    Create A Room
                </Button>
            </Grid>
            <Grid item>
                <Button color="primary" variant="contained" component={Link} to="/">
                    Back
                </Button>
            </Grid>
        </Grid>
    );

    const renderUpdateButtons = () => (
        <Grid container spacing={1}>
            <Grid item>
                <Button color="secondary" variant="contained" onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
            <Grid item>
                <Button color="primary" variant="contained" component={Link} to="/">
                    Back
                </Button>
            </Grid>
        </Grid>
    );

    const title = update ? "Update Room" : "Create A Room";

    return (
        <Grid
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
        >
            <Grid item xs={12}>
                <Collapse in={errorMessage !== "" || successMessage !== ""}>
                    {successMessage && (
                        <Alert severity="success" onClose={() => setSuccessMessage("")}>
                            {successMessage}
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert severity="error" onClose={() => setErrorMessage("")}>
                            {errorMessage}
                        </Alert>
                    )}
                </Collapse>
            </Grid>

            <Grid item>
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Control Of Playback State</div>
                    </FormHelperText>
                    <RadioGroup
                        row
                        value={guestCanPauseState.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl>
                    <TextField
                        required
                        type="number"
                        onChange={handleVotesChange}
                        value={votesToSkipState}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" },
                        }}
                    />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip The Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>

            {update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}
