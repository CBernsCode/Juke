import React, { Component } from "react";
import { Container, Segment, Button, List, Image } from 'semantic-ui-react';
import Player from "./Player";
import { SSL_OP_SINGLE_DH_USE } from "constants";


export default class Playlist extends Component {
  constructor() {
    super();

    this.state = {
      playlists: null,
      playlist_tracks: null,
      trackView: false,
      error: null,
    };
  }

  handleRetrievePlaylists = () => {
    // TODO
    // How to grab token from Player?
    let token = "BQA1uKFU-EPOmZPJm3VfTENP6ln-0_hMYpj1ft_eJcCPcWxsNe3TdKxq5iZg8_QDvKc2PMXVY-bHMyDkJAbNjrJZp4IjJWQSSK6nb5IauWNDLhiBMoa8TlW5bnDo4lH3yfthrUuo6GO2ycuJjyzPzvbnrIMLBzJiWv_VYaiCmZNrr1KQNCOF23z_segOz1D4RQMeLWJML0TflHG7n64CU9ecn-AdC4pUVgP-nI_UXYVBlOL0BXqBfe9-rNFzI50tCro";

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
    // TODO
    // How to grab token from Player?
    let token = "BQA1uKFU-EPOmZPJm3VfTENP6ln-0_hMYpj1ft_eJcCPcWxsNe3TdKxq5iZg8_QDvKc2PMXVY-bHMyDkJAbNjrJZp4IjJWQSSK6nb5IauWNDLhiBMoa8TlW5bnDo4lH3yfthrUuo6GO2ycuJjyzPzvbnrIMLBzJiWv_VYaiCmZNrr1KQNCOF23z_segOz1D4RQMeLWJML0TflHG7n64CU9ecn-AdC4pUVgP-nI_UXYVBlOL0BXqBfe9-rNFzI50tCro";

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
  createPlaylist = () => {

  }

  // TODO
  // Make playlist collaborative
  makeCollaborative = () => {

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
        {this.state.playlists && !this.state.trackView && (
          <List id="playlist-names" divided inverted ordered>
            {
              this.state.playlists.items
                .map((playlist)=> {
                  return this.listPlaylistItem(playlist)
                })
            }
          </List>
        )}
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
