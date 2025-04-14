import React, { Component } from 'react';

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanStop: false,
            isHost: false,
        };
        this.roomCode = this.props.roomCode || this.props.match?.params?.roomCode;
    }

    componentDidMount() {
        console.log('Room component mounted');
        this.getRoomDetails();
    }

    getRoomDetails() {
        console.log('Fetching room details...');
        fetch(`/api/get-room?code=${this.roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch room details');
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanStop: data.guest_can_stop,
                    isHost: data.is_host,
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    render() {
        return (
            <div>
                <h3>Room Code: {this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Stop: {this.state.guestCanStop.toString()}</p>
                <p>Is Host: {this.state.isHost.toString()}</p>
            </div>
        );
    }
}
