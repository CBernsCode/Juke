// tutorial used: https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../constants/Config";
import hash from "../actions/Hash";
// import logo from "./logo.svg";
// import "./App.css";
import "../css/player.css";


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


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
    // await window.Spotify;

    // if the Spotify SDK has loaded
    while (!window.Spotify) { 
      await sleep(30)
    }
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
    this.player.on('ready', async data => {
      let { device_id } = data;
      // set the deviceId variable, then try
      // to swap music playback to Juke
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere(device_id);
    });
  }

  transferPlaybackHere = (deviceId) => {
    // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${this.state.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        // true: start playing music if it was paused on the other device
        // false: paused if paused on other device, start playing music otherwise
        "play": true,
      }),
    });
  }

   // when we receive a new update from the player
   onStateChanged = (state) => {
    // only update if we got a real state
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const is_playing = !state.paused;
      
      this.setState({
        position,
        duration,
        item: currentTrack,
        is_playing
      });
    } else {
      // state was null, user might have swapped to another device
      this.setState({ error: "Looks like you might have swapped to another device?" });
    }
  }

  onPrevClick = () => {
    this.player.previousTrack();
  }
  
  onPlayClick = () => {
    this.player.togglePlay();
  }
  
  onNextClick = () => {
    this.player.nextTrack();
  }

  render() {
    const { is_playing } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          {/* Get token */}
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
          {/* Display player once token acquired */}
          {this.state.token && (
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
                  <p>
                    <button onClick={() => this.onPrevClick()}>Previous</button>
                    <button onClick={() => this.onPlayClick()}>{is_playing ? "Pause" : "Play"}</button>
                    <button onClick={() => this.onNextClick()}>Next</button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}