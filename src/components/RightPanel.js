import React, { Component } from 'react'
import { Button, Icon, List, Segment } from 'semantic-ui-react'
import { gameState } from '../reducers/Session';

import firebase from '../firebase';

import Game from './Game';
import SearchBar from './Search';

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }


export default class RightPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: gameState.playing,
      seedsLeft: null,
      selecting: false,
      indexToReplace: 0
    }
  }

  componentDidUpdate(prevProps) {
    const { session } = this.props.sesh
    const { sessionActions } = this.props
    const { selectedTrackId } = this.props.media

    // Seeding logic
    if (this.state.seedsLeft >= 0 && selectedTrackId !== prevProps.media.selectedTrackId) {
      this.addSongToVoting(selectedTrackId, this.state.seedsLeft)
      if (this.state.seedsLeft === 0) {
        
        sessionActions.changeSessionState(gameState.waiting)
        this.setState({ seedsLeft: null });
        setTimeout(() => {
          firebase.ref(`/session/${session}/state`).set(gameState.playing)
        }, 25000);

      } else {   
        this.setState({ seedsLeft: this.state.seedsLeft - 1 })
      }
    }

    // If we won a game and we selected a song add it to voting
    if (!!this.state.selecting && selectedTrackId !== prevProps.media.selectedTrackId) {
      this.addSongToVoting(selectedTrackId, this.state.indexToReplace)
      this.setState({ selecting: false })
      firebase.ref(`/session/${session}/state`).set(gameState.playing)
    }

    // handle session changes
    if (session !== prevProps.sesh.session) {
      firebase.ref(`/session/${session}/state`).once('value', (snapshot) => {
        const newState = snapshot.val()
        if (!!newState) {
          sessionActions.changeSessionState(newState)
        }
      })

      firebase.ref(`/session/${session}/state`).on('value', (snapshot) => {
        const newState = snapshot.val()
        if (!!newState) {
          sessionActions.changeSessionState(newState)
        }
      })

      firebase.ref(`/session/${this.props.sesh.session}/winner`).on('value', snapshot => {
        let snap = snapshot.val()
        if (snap === this.props.acct.uid) {
          sessionActions.changeSessionState(gameState.winner)
          console.log("Your are the winner!")

          this.determineWinningSong()
          this.setState({ selecting: true })

          setTimeout(() => {
            firebase.ref(`/session/${session}/state`).set(gameState.playing)
          }, 30000);

        } else if (snap === "") {
          sessionActions.changeSessionState(gameState.playing)
          console.log("Playing...")

          // setTimeout(() => {
          //   if (Date.now() % 2 == 0) {
          //     firebase.ref(`/session/${session}/winner`).set("")
          //   } else {
          //     firebase.ref(`/session/${session}/winner`).set("cberns223")
          //   }
          //   firebase.ref(`/session/${session}/state`).set(gameState.waiting)
          // }, 180000);

        } else {
          sessionActions.changeSessionState(gameState.waiting)
          console.log("Sorry you didn't win...")

          // setTimeout(() => {
          //   firebase.ref(`/session/${session}/state`).set(gameState.playing)
          // }, 30000);
        }
      })
    }
  }

  componentWillUnmount = () => {
    if (!!this.props.session && this.props.session.id) {
      try {
        firebase.ref(`/session/${this.props.sesh.session}/state`).on('value', () => { })
        firebase.ref(`/session/${this.props.sesh.session}/winner`).on('value', () => { })
      } catch (error) {
        throw Error("Was unable to detach from session ref")
      }
    }
  }

  addSongToPlaylist = (trackId) => {
    const { token, playlist_id } = this.props.media
    let track_uri = "spotify:track:" + trackId

    // https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
    fetch("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "uris": [track_uri],
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
        console.log("added track to playlist")
      })
      .catch(error => {
        this.setState({ error })
        console.log(error)
      });
  }

  winner = () => {
    const { token } = this.props.media
    return (
      !token
        ? <h1>Please Login</h1>
        : <Segment centered inverted>
          <h1>You won!</h1>
          <h3>Please pick your song for the playlist.</h3>
          <SearchBar {...this.props} />
        </Segment>
    )
  }

  determineWinningSong = () => {
    firebase.ref(`/session/${this.props.sesh.session}/songs`)
      .once('value')
      .then(snapshot => {
        let trackId = ""
        let highestBid = -1
        let snap = snapshot.val()
        !!snap && [].concat(snap).map((song, index) => {
          let sum = 0;
          if (!!song.bid) {
            Object.keys(song.bid).forEach(key => {
              sum += Number(song.bid[key] || 0)
            })
          }
          if (sum > highestBid) {
            highestBid = sum
            trackId = song.trackId
            this.setState({indexToReplace: index })
          }
        })
        this.addSongToPlaylist(trackId)
        // this.addSongToVoting(trackId, 3)
        console.log(trackId)
      })
  }

  setWinner = (uid) => {
    firebase.ref(`/session/${this.props.sesh.session}/winner`).set(uid)
  }

  addSongToVoting = (trackId, index) => {
    const { token } = this.props.media
    const { session } = this.props.sesh || "Error"

    // set up next round
    setTimeout(() => {
      firebase.ref(`/session/${session}/state`).set(gameState.playing)
      firebase.ref(`/session/${session}/winner`).set("")
      firebase.ref(`/session/${session}/nextRound`).set(Date.now() + 60000)
    }, 20000);

    if (!token || !session || !trackId) return
    fetch("https://api.spotify.com/v1/tracks/" + trackId, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(json => {
        let artist = json.artists[0].name
        let { name, preview_url } = json
        let preview_art = json.album.images[1].url
        firebase.ref(`/session/${session}/songs/${index || 0}`).set({
          name,
          trackId,
          preview_url,
          artist,
          preview_art,
          bid: { "0": 0 }
        })
      })
  }

  seeding = () => {
    // this.addSongToVoting("4gEAYcaZPHpFFelzdt7pBX", 0)
    // this.addSongToVoting("1r5J8bYOWq1Dal5jMQ06WX", 1)
    // this.addSongToVoting("0DRAw7SODdYDqaInkjkS2v", 2) 
    // this.addSongToVoting("44gbF5jrs7bljifR1X8ECK", 3)
    if (this.state.seedsLeft === null) {
      this.setState({ seedsLeft: 3 })
    }

    // in 30 seconds set it to null if we get a seeding error
    setTimeout(() => {
      this.setState({ seedsLeft: null })
    }, 60000)

    return (
      <>
        <h1>Choose 4 songs</h1>
        <SearchBar {...this.props} />
      </>
    )
  }


  waiting = () => (
    <Segment centered inverted>
      <h1>Please Wait!</h1>
      <h3>We are preparing the next round.</h3>
    </Segment>
  )

  changeSeshStateBtns = () => {
    const { sessionActions } = this.props
    return (
      <Button.Group>
        <Button onClick={() => sessionActions.changeSessionState(gameState.waiting)}>Waiting</Button>
        <Button onClick={() => sessionActions.changeSessionState(gameState.playing)}>Playing</Button>
        <Button onClick={() => sessionActions.changeSessionState(gameState.winner)}>Winner</Button>
      </Button.Group>
    )
  }

  selector = () => {
    const { status } = this.props.sesh
    switch (status) {
      case gameState.playing:
        return <Game {...this.props} />
      case gameState.winner:
        return this.winner()
      case gameState.waiting:
        return this.waiting()
      case "seeding":
        return this.seeding()
      default:
        break;
    }
  }

  render() {
    return (
      <Segment id="right-panel" inverted >
        <this.changeSeshStateBtns />
        {/* <h2>TODO: Handle State Internally</h2> */}
        {this.selector(gameState.winner)}
      </Segment>
    )
  }
}