import React, { Component } from 'react'
import { Button, Icon, List, Segment } from 'semantic-ui-react'
import { gameState } from '../reducers/Session';

import Game from './Game';
import SearchBar from './Search';

export default class RightPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: gameState.playing
    }
  }

  componentDidMount = () => {

    // cycle through modes
    // setInterval(() => this.setState({ state: gameState.waiting }), 20000)
    // setInterval(() => this.setState({ state: gameState.playing }), 30000)
    // setInterval(() => this.setState({ state: gameState.winner }), 60000)
  }

  winner = () => {
    const { token } = this.props.media
    return (
      !token 
        ? <h1>Please Login</h1>
        :<Segment centered inverted>
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
    const { state } = this.props.sesh
    switch (state) {
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