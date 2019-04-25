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
      state: gameState.playing
    }
  }

  componentDidUpdate(prevProps) {
    const { session } = this.props.sesh
    // Typical usage (don't forget to compare props):
    if (session !== prevProps.sesh.session) {
      const { sessionActions } = this.props
      firebase.ref(`/session/${session}/state`).on('value', (snapshot) => {
        const newState = snapshot.val()
        if (!!newState) {
          sessionActions.changeSessionState(newState)
        }
      })
      firebase.ref(`/session/${this.props.sesh.session}/winner`)
      .on('value', snapshot => {
        let snap = snapshot.val()
        if(snap === this.props.acct.uid){
          sessionActions.changeSessionState(gameState.winner)
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