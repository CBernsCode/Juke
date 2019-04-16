import React, { Component } from 'react'
import { Button, Icon, List, Segment } from 'semantic-ui-react'

import Game from './Game';
import SearchBar from './Search';

const gameState = {
  playing: "playing",
  winner: "winner",
  waiting: "waiting"
}

export default class RightPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: gameState.winner
    }
  }

  componentDidMount = () => {

    // cycle through modes
    setInterval(() => this.setState({ state: gameState.waiting }), 20000)
    setInterval(() => this.setState({ state: gameState.playing }), 30000)
    setInterval(() => this.setState({ state: gameState.winner }), 60000)
  }

  winner = () => (
    <Segment centered inverted>
      <h1>You won!</h1>
      <h3>Please pick your song for the playlist.</h3>
      <SearchBar {...this.props} />
    </Segment>
  )

  waiting = () => (
    <Segment centered inverted>
      <h1>Please Wait!</h1>
      <h3>We are preparing the next round.</h3>
    </Segment>
  )

  selector = () => {
    const { state } = this.state
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
        {this.selector(gameState.winner)}
      </Segment>
    )
  }
}