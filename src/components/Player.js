// tutorial used: https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "../constants/Config";
import hash from "../actions/Hash";
import Player from "./PlayerController";
// import logo from "./logo.svg";
// import "./App.css";
import "../css/player.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms:0,
      },
      is_playing: false,
      progress_ms: 0,
      loggedIn: false,
      deviceId: "",
      error: "",
      position: 0,
      duration: 1,
    };
    // this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token,
        loggedIn: true,
      });

      this.createPlayer(_token);
    }    
  }

  async createPlayer(_token){
    console.log("about to await");
    await window.Spotify;
    console.log("we awaited");

    // if the Spotify SDK has loaded
    if (!!window.Spotify) { 
      console.log("creating new Spotify player with token " + _token);
      // create a new player
      this.player = new window.Spotify.Player({
        name: "Juke",
        getOAuthToken: cb => { cb(_token); },
      });
      // set up the player's event handlers
      this.createEventHandlers();
      
      // finally, connect!
      this.player.connect();
    }

    this.getCurrentlyPlaying(_token)
    .then(() => {
      this.transferPlaybackHere();
    });
  }

  createEventHandlers = () => {
    // problem setting up the player
    this.player.on('initialization_error', e => { console.error(e); });
    // problem authenticating the user.
    // token was invalid 
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    // currently only premium accounts can use the API
    this.player.on('account_error', e => { console.error(e); });
    // loading/playing the track failed for some reason
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));
  
    // Ready
    // this.player.on('ready', async data => {
    //   let { device_id } = data;
    //   // set the deviceId variable, then let's try
    //   // to swap music playback to *our* player!
    //   await this.setState({ deviceId: device_id });
    //   this.transferPlaybackHere();
    // });
  }

  getCurrentlyPlaying = (token) => {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        console.log("data", data);
        if (!!data) {
          this.setState({
            item: data.item,
            is_playing: data.is_playing,
            progress_ms: data.progress_ms,
            deviceId: data.device.id,
          });
        }
      }
    });
  }

  transferPlaybackHere = () => {
    // const { deviceId, token } = this.state.token;
    // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${this.state.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ this.state.deviceId ], //deviceId ],
        // true: start playing music if it was paused on the other device
        // false: paused if paused on other device, start playing music otherwise
        "play": true,
      }),
    });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            // <Player
            //   token={this.state.token}
            //   item={this.state.item}
            //   is_playing={this.state.is_playing}
            //   progress_ms={this.progress_ms}
            // />
            <div className="App">
      <div className="main-wrapper">
        <div className="now-playing__img">
          <img src={this.state.item.album.images[0].url} />
        </div>
        <div className="now-playing__side">
          <div className="now-playing__name">{this.state.item.name}</div>
          <div className="now-playing__artist">
            {this.state.item.artists[0].name}
          </div>
          <div className="now-playing__status">
            {this.state.is_playing ? "Playing" : "Paused"}
          </div>
          {/* <div className="progress">
            <div
              className="progress__bar"
              style={progressBarStyles}
            />
          </div> */}
        </div>
        {/* <div className="background" style={backgroundStyles} />{" "} */}
      </div>
    </div>
          )}
        </header>
      </div>
    );
  }
}