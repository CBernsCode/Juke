import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { TapGame } from './TapBeat'
import { gameStart } from '../games/TabBeat'
import { SurvivalGame } from './SurvivalGame'


const GAME_STATUS = {
  notStated: "NOT_STARTED",
}

let date = new Date();

date.getMinutes();
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
          { Math.floor(date.getMinutes()) % 2 ? <TapGame {...this.props} /> : <SurvivalGame  {...this.props}/>}
        </div>
        {/* <Jumper /> */}
        {/* <SurvivalGame {...this.props} /> */}
      </Segment>
    )
  }
}

