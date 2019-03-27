import React, { Component } from 'react';
import hash from "../actions/Hash";
import "../css/player.css";

export default class Player extends Component {
  constructor(props) {
    super(props);
    // set the initial state
    this.state = {
        token: props.token,
        item: props.item,
        is_playing: props.is_playing,
        progress_ms: props.progress_ms,
        loggedIn: true,
        deviceId: "",
        error: "",
        trackName: "Track Name",
        artistName: "Artist Name",
        albumName: "Album Name",
        position: 0,
        duration: 1,
    };
  }

  componentDidMount() {
    const { token } = this.state.token;
    
    // if the Spotify SDK has loaded
    if (window.Spotify !== null) {
      console.log("creating new Spotify player with token " + token);
      // create a new player
      this.player = new window.Spotify.Player({
        name: "Juke",
        getOAuthToken: cb => { cb(token); },
      });
      // set up the player's event handlers
      this.createEventHandlers();
      
      // finally, connect!
      this.player.connect();
    }
    else {
      console.log("window.Spotify is null");
    }
  }

  
  // when we receive a new update from the player
  onStateChanged(state) {
    // only update if we got a real state
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const is_playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        is_playing
      });
    } else {
      // state was null, user might have swapped to another device
      this.setState({ error: "Looks like you might have swapped to another device?" });
    }
  }
  
  createEventHandlers() {
    // problem setting up the player
    this.player.on('initialization_error', e => { console.error(e); });
    // problem authenticating the user.
    // either the token was invalid in the first place,
    // or it expired (it lasts one hour)
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
      console.log("Let the music play on!");
      // set the deviceId variable, then let's try
      // to swap music playback to *our* player!
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }
  
  onPrevClick() {
    this.player.previousTrack();
  }
  
  onPlayClick() {
    this.player.togglePlay();
  }
  
  onNextClick() {
    this.player.nextTrack();
  }
  
  transferPlaybackHere() {
    const { deviceId, token } = this.state.token;
    // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
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
  
  render() {
    const {
      token,
      item,
      is_playing,
      progress_ms,
      loggedIn,
      trackName,
      artistName,
      albumName,
      error,
    } = this.state;
    
    return (
      <div className="PlayerController">      
        {error && <p>Error: {error}</p>}
        <div>      
          <p>Artist: {artistName}</p>
          <p>Track: {trackName}</p>
          <p>Album: {albumName}</p>
          <p>
            <button onClick={() => this.onPrevClick()}>Previous</button>
            <button onClick={() => this.onPlayClick()}>{is_playing ? "Pause" : "Play"}</button>
            <button onClick={() => this.onNextClick()}>Next</button>
          </p>
        </div>
        }
      </div>
    );
  }
}
