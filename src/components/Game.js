import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Jumper from './Jumper'
import {gameStart} from '../games/TabBeat'
// import '../css/TabBeat'


const GAME_STATUS = {
  notStated: "NOT_STARTED",
}

export default class Game extends Component {
  constructor(props) {
    super(props);
    // You can initialize state properties here
    this.state = {
      gameStatus: GAME_STATUS.notStated
    }
  }

  componentDidMount() {
    gameStart()
  }
  render() {
    return (
      <Segment id="game" inverted>
        <Header as='h1' textAlign='center'>
          Game
        </Header>
        <div id="game">
          <h1 id="header">Tap Beat Game</h1>
          <p>Objective: Tap the buttons in the given time period.</p>

          <button onclick="gameStart()">Start</button>
        </div>
        {/* <Jumper /> */}
      </Segment>
    )
  }
}

