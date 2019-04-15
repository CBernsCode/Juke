import React, { Component } from "react";
import { Container, Segment, Button, List, Image, Icon } from 'semantic-ui-react';
import "../css/index.css";

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

  componentDidMount(){
    if(!!this.props.media.token){
      this.handleRetrievePlaylists()
    }
  }

  handleRetrievePlaylists = () => {
    const { token } = this.props.media
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
      this.setState({ playlists: data })
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }

  openPlaylist = (id) => {
    const { token } = this.props.media
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

  createPlaylist = () => {
    const { token, userId } = this.props.media
    // TODO
    // user defined playlist names
    let name = "test";

    // https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-change-playlist-details
    fetch("https://api.spotify.com/v1/users/" + userId + "/playlists", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": name,
        "public": false,
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

  // check to see if playlist is set to collaborative or not
  playlistIsCollaborative = (id) => {
    const { token } = this.props.media

    

    // https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
    fetch("https://api.spotify.com/v1/playlists/" + id, {
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
      console.log("is playlist collab: ", data.collaborative)
      return data.collaborative
    })
    .catch(error => {
      this.setState({ error })
      console.log(error)
    });
  }

  // Make playlist collaborative
  // Note: You can only set collaborative to true on non-public playlists.
  toggleCollaborative = (id) => {
    const { token } = this.props.media
    let isPublic, isCollaborative = new Boolean
    
    if (this.playlistIsCollaborative(id)) {
      isPublic = false
      isCollaborative = true
    }
    else {
      isPublic = true
      isCollaborative = false
    }

    console.log("CHANGING\nisPublic: ", isPublic, "\isCollab: ", isCollaborative)
    
    // https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-change-playlist-details
    fetch("https://api.spotify.com/v1/playlists/" + id, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "public": isPublic,
        "collaborative": isCollaborative,
      }),
    })
    
  }

  listPlaylistItem = (playlist) => (
    <List.Item key={playlist.id} onClick={() => this.openPlaylist(playlist.id)}>
    { playlist.images[0] ? 
      <Image size="mini" avatar src={playlist.images[0].url} />
      :
      // TODO
      // Change to question mark or something
      <Icon name='play' />
    }
      <List.Content>
        {playlist.name}
      </List.Content>
    </List.Item>
  )

  listTrackItem = (tracks) => (
    <List.Item key={tracks.track.id}>
      <Image size="mini" avatar src={tracks.track.album.images[0].url} />
      <List.Content>
        {tracks.track.artists[0].name} <br />
        {tracks.track.name} <br />
      </List.Content>
    </List.Item>
  )

  render() {

    return (
      <Segment id="playlists" inverted>
        {this.state.playlists && !this.state.trackView && [
          <List id="playlist-names" divided inverted ordered>
            {
              this.state.playlists.items
                .map((playlist) => {
                  return this.listPlaylistItem(playlist)
                })
            }
          </List>,
          <Button.Group fluid>
            <Button
              fluid
              color="green"
              inverted 
              onClick={ () => this.createPlaylist() } >
              New Playlist
            </Button>
          </Button.Group>
        ]}
        {this.state.playlists && this.state.trackView && [
          <List id="track-names" divided inverted ordered>
            {
              this.state.playlist_tracks.items
                .map((tracks) => {
                  return this.listTrackItem(tracks)
                })
            }
          </List>,
          <Button.Group fluid widths="8">
            <Button
              color="green"
              inverted
              onClick={() => this.setState({ trackView: false })} >
              Go Back
            </Button>
            <Button
              color="green"
              inverted
              onClick={() => this.toggleCollaborative(this.state.current_playlist_id)} >
              {
                this.playlistIsCollaborative(this.state.current_playlist_id)
                ? "Undo Collaborative"  
                : "Make Collaborative"
              }
          </Button> 
        </Button.Group>

        ]}
      </Segment>
    );
  }
}
