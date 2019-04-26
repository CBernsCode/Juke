import React, { Component } from 'react'
import { Button, Icon, List, Segment } from 'semantic-ui-react'
import { gameState } from '../reducers/Session';

import firebase from '../firebase';

import Game from './Game';
import SearchBar from './Search';

export default class RightPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: gameState.playing,
      seedsLeft: null
    }
  }

  componentDidUpdate(prevProps) {
    const { session } = this.props.sesh
    const { sessionActions } = this.props
    const { selectedTrackId } = this.props.media

    if (this.state.seedsLeft >= 0 && selectedTrackId !== prevProps.media.selectedTrackId) {
      this.addSongToVoting(selectedTrackId, this.state.seedsLeft)
      this.setState({ seedsLeft: this.state.seedsLeft - 1 })
      if (this.state.seedsLeft === 0) {
        sessionActions.changeSessionState(gameState.waiting)
        setTimeout(() => {
          firebase.ref(`/session/${session}/state`).set(gameState.playing)
        }, 15000);
      }
    }


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
      firebase.ref(`/session/${this.props.sesh.session}/winner`)
        .on('value', snapshot => {
          let snap = snapshot.val()
          if (snap === this.props.acct.uid) {
            sessionActions.changeSessionState(gameState.winner)
            this.determineWinningSong()
            console.log("Your are the winner!")
          } else if (snap === "") {
            sessionActions.changeSessionState(gameState.playing)
            console.log("Playing...")
          } else {
            sessionActions.changeSessionState(gameState.waiting)
            console.log("Sorry you didn't win...")
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
        !!snap && [].concat(snap).map(song => {
          let sum = 0;
          if (!!song.bid) {
            Object.keys(song.bid).forEach(key => {
              sum += Number(song.bid[key] || 0)
            })
          }
          if (sum > highestBid) {
            highestBid = sum
            trackId = song.trackId
          }
        })
        console.log("swapped")
      })
  }

  setWinner = (uid) => {
    firebase.ref(`/session/${this.props.sesh.session}/winner`).set(uid)
  }

  addSongToVoting = (trackId, index) => {
    const { token } = this.props.media
    const { session } = this.props.sesh || "Error"

    if (!token || !session) return
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
        var newSongRef = firebase.ref(`/session/${session}/songs/${index}`)
        newSongRef.set({
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
      this.setState({ seedsLeft: 3 });
    }
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
        <h2>TODO: Handle State Internally</h2>
        <this.changeSeshStateBtns />
        {this.selector(gameState.winner)}
      </Segment>
    )
  }
}