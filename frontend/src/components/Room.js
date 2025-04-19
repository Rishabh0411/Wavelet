import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    navigate("/");
                }
                return response.json();
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            })
            .catch((error) => {
                console.error("Error fetching room details:", error);
            });
    }, [roomCode, navigate]);

    return (
        <div>
            <h3>Room Code: {roomCode}</h3>
            <p>Votes Required To Skip: {votesToSkip}</p>
            <p>Guest Can Pause Playback: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    );
}
