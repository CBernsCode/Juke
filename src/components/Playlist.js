import React, { Component } from "react";
import { Container, Segment, Button, List, Image } from 'semantic-ui-react';
import Player from "./Player";
import { SSL_OP_SINGLE_DH_USE } from "constants";

// TODO
// How to grab valid token from Player object?
let token = "BQCNNlvNIp9a3yVDeI6tCP9HRWqfXL_zseRqmqgrSyJP8AZsSdcrqai8DGSf1hJg3IDy5yaVcLlc03G1SmMBcb9cOrTY-lfFXIfZpKld5FpALy-nTNJ5uyfokjCUcwucR__EVwllq3KN0vlwKVVB39_h7DkSBLegSDcNecuserdOiPfIeSL6zMKI2r0iMaqK27FyR-TXe0Z-kjjQsX3WZA4D8tK9G8nG81f5VV6gdqFZv9Gc2ulVWju0HLwLURQqhbM";

export default class Playlist extends Component {
  constructor() {
    super();

    this.state = {
      playlists: null,
      playlist_tracks: null,
      current_playlist_id: "",
      trackView: false,
      error: null,
    };
  }

  handleRetrievePlaylists = () => {
    // https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
    fetch("https://api.spotify.com/v1/me/playlists", {
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
      console.log(data)
      this.setState({ playlists: data })
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }

  openPlaylist = (id) => {
    // https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
    fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks", {
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
      console.log(data)
      this.setState({ 
        current_playlist_id: id,
        playlist_tracks: data,
        trackView: true,
       })
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }

  // TODO
  // Generate new collaborative playlist
  createPlaylist = (user_id, name) => {
    return
    // https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-change-playlist-details
    fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": name,
        "collaborative": true,
      }),
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
      this.setState({ 
        trackView: false,
       })
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }


  // Make playlist collaborative
  // Note: You can only set collaborative to true on non-public playlists.
  makeCollaborative = (id) => {
    // https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-change-playlist-details
    fetch("https://api.spotify.com/v1/playlists/" + id, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "collaborative": true,
      }),
    })
  }

  listPlaylistItem = (playlist) => (
    <List.Item key={playlist.id}>
      <List.Content>
        <List.Header>
          <Image size="small" src={playlist.images[0].url} 
            onClick={ () => this.openPlaylist(playlist.id) }/>
          <div className="playlist-info">
            {playlist.name} <br />
          </div>
        </List.Header>
      </List.Content>
    </List.Item>
  )

  listTrackItem = (tracks) => (
    <List.Item key={tracks.track.id}>
      <List.Content>
        <List.Header>
          <Image size="tiny" src={tracks.track.album.images[0].url}/>
          <div className="track-info">
            {tracks.track.artists[0].name} <br /> 
            {tracks.track.name} <br />
          </div>
        </List.Header>
      </List.Content>
    </List.Item>
  )

  // TODO
  // Make tab persistent
  // Automatically grab playlists on Spotify authentication with valid token
  render() {
    return (
      <Segment id="playlists" inverted>
        {!this.state.playlists && (
          <Button 
            fluid
            style={{
              margin: "auto",
              width:"50%"
            }}
            color="green"
            inverted
            onClick={ () => this.handleRetrievePlaylists()} >
            Get Playlists
          </Button>
        )}
        {this.state.playlists && !this.state.trackView && [
          <Button 
          fluid
          style={{
            margin: "auto",
            width:"50%"
          }}
          color="green"
          inverted >
          {/* onClick={ () => this.createPlaylist(user_id, name) } > */}
          New Playlist
        </Button>,
          <List id="playlist-names" divided inverted ordered>
            {
              this.state.playlists.items
                .map((playlist)=> {
                  return this.listPlaylistItem(playlist)
                })
            }
          </List>
        ]}
        {this.state.playlists && this.state.trackView && [
          <Button 
            fluid
            style={{
              margin: "auto",
              width:"50%"
            }}
            color="green"
            inverted
            onClick={ () => this.setState({ trackView: false })} >
            Go Back
          </Button>,
          <Button 
            fluid
            style={{
              margin: "auto",
              width:"50%"
            }}
            color="green"
            inverted
            onClick={ () => this.makeCollaborative(this.state.current_playlist_id)} >
            Make Collaborative
          </Button>,
          <List id="track-names" divided inverted ordered>
          {
            this.state.playlist_tracks.items
              .map((tracks)=> {
                return this.listTrackItem(tracks)
              })
          }
          </List>
        ]}
      </Segment>
    );
  }
}
