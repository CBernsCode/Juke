import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import {Jumper} from './Jumper'
import { TapGame } from './TapBeat'
import { gameStart } from '../games/TabBeat'
import { SurvivalGame } from './SurvivalGame'


const GAME_STATUS = {
  notStated: "NOT_STARTED",
}

let date = new Date();
let min = date.getMinutes();
let diffGames = Math.floor(min) % 2;

export default class Game extends Component {
  constructor(props) {
    super(props);
    // You can initialize state properties here
    this.state = {
      gameStatus: GAME_STATUS.notStated
    }
  }

  render() {
    return (
      <Segment inverted>
        <Header as='h1' textAlign='center'>
          Game
        </Header>
        <div>
          {diffGames ? <TapGame/> : <SurvivalGame/>}
        </div>
        {/* <Jumper /> */}
        <SurvivalGame {...this.props} />
      </Segment>
    )
  }
}

