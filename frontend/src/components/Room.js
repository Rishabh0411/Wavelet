import React, { Component } from 'react';

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanStop: false,
            isHost: false,
        };
        this.roomCode = this.props.match.params.roomCode;
    }               

    render() {
        return (
            <div>
                <h3>Room Code: {this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Stop: {this.state.guestCanStop}</p>
                <p>Is Host: {this.state.isHost}</p>
            </div>
        );
    }
}