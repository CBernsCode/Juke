// tutorials used: 
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6
// https://medium.com/@jonnykalambay/now-playing-using-spotifys-awesome-api-with-react-7db8173a7b13
// https://mbell.me/blog/2017-12-29-react-spotify-playback-api/

import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../constants/Config";
import { Button, Divider, Grid, Icon, Segment } from 'semantic-ui-react'
import hash from "../actions/Hash";
import "../css/player.css";
import "../css/index.css";  
import Tabs from './Tabs';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class Player extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        id: "",
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0,
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

  getBPM = () => {
    const { mediaActions } = this.props

    if (this.state.item.id !== "") {
      // https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
      fetch("https://api.spotify.com/v1/audio-features/" + this.state.item.id, {
        method: "GET",
        headers: {
          authorization: `Bearer ${this.state.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error("Something went wrong...")
        }
      })
      .then(data => {
          mediaActions.saveTempo(data.tempo)
      })
      .catch(error => {
          this.setState({ error })
          console.log(error)
      });
      }
  }

  componentDidMount() {
    const { mediaActions } = this.props

    // Get token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token,
        loggedIn: true,
      });

      mediaActions.saveToken(_token);
      this.getUserId(_token);
      this.createPlayer(_token);
      this.getProfileData(_token);
    }
  }

  getUserId = (token) => {
    const { mediaActions, sessionActions } = this.props

    fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) { 
        return response.json()
      } 
      else {
        throw new Error("Something went wrong...")
      }
    })
    .then(data => {
      mediaActions.saveUserId(data.id)
      sessionActions.getCurrentSession(data.id)
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }

  getCurrentlyPlaying = () => {
    const { token } = this.props.media 
    const { mediaActions } = this.props

    // https://developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      else {
        throw new Error("Something went wrong...")
      }
    })
    .then(data => {
        console.log("currently playing: ", data.item.name, " from a(n) ", data.context.type)
        if (data.context.type == "playlist") {
          mediaActions.loadPlaylist(data.context.uri)
        }
        else {
          mediaActions.loadPlaylist("")
        }
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }

  async createPlayer(_token) {
    
    // wait for the Spotify SDK to load
    while (!window.Spotify) {
      await sleep(30)
    }

    // create a new player
    this.player = new window.Spotify.Player({
      name: "Juke",
      getOAuthToken: cb => { cb(_token); },
    });
    // set up the player's event handlers
    this.createEventHandlers();

    // finally, connect
    this.player.connect();
  }

  getProfileData = (token) => {
    const { friendActions, acctActions } = this.props
    fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(doc => doc.json())
      .then(profile => {
        friendActions.loadFriends(profile.id)
        acctActions.login({
          displayName: profile.display_name,
          uid: profile.id,
        })
        console.log(profile)
      })
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
        "device_ids": [deviceId],
        // true: start playing music if it was paused on the other device
        // false: paused if paused on other device, start playing music otherwise
        "play": false,
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

      // Get tempo
      this.getBPM()

      // Get information on currently playing track
      this.getCurrentlyPlaying()

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

  onPrevClick = () => { this.player.previousTrack() }
  onPlayClick = () => { this.player.togglePlay() }
  onNextClick = () => { this.player.nextTrack() }

  render() {
    const { is_playing } = this.state;

    return (
      <Segment id="player" inverted padded={false}>
        {/* Get token
        {!this.state.token && (
          <Button 
            style={{
              marginTop: "60%",
            }}
            color="green"
            size="huge"
            inverted
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}>
            Login to Spotify
          </Button>
        )}
        {/* Display player once token acquired */}
          <Grid >
            <Grid.Row verticalAlign='middle'>
              <Grid.Column width={4}>
                <img height="100" src={this.state.item.album.images[0].url} /><br />
                {/* {this.state.item.album.name} */}
              </Grid.Column>
              <Grid.Column width={12}>
                {`${this.state.item.name} - ${this.state.item.artists[0].name}`}<br />
                <Button.Group id="player-controls" icon>
                  <Button
                    inverted
                    basic
                    onClick={() => this.onPrevClick()} >
                    <Icon name='fast backward' />
                  </Button>
                  {
                    is_playing
                      ? <Button
                        inverted
                        basic
                        onClick={() => this.onPlayClick()}>
                        <Icon name='pause' />
                      </Button>
                      : <Button
                        inverted
                        basic
                        onClick={() => this.onPlayClick()}>
                        <Icon name='play' />
                      </Button>
                  }
                  <Button
                    inverted
                    basic
                    onClick={() => this.onNextClick()} >
                    <Icon name='fast forward' />
                  </Button>
                </Button.Group>
              </Grid.Column>
              </Grid.Row>
            <Divider style={{margin: "0", borderColor: "#fff", borderTop: 0}} />
            <Grid.Row >
              <Grid.Column width={16} textAlign='left'>
                <Tabs {...this.props} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </Segment>

    );
  }
}