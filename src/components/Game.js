import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { gameStart } from '../games/TabBeat'
import { SurvivalGame } from './SurvivalGame'
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

  }

  
  render() {
    return (
      <Segment inverted>
        <Header as='h1' textAlign='center'>
          Game
        </Header>
        {/* <Jumper /> */}
        <SurvivalGame {...this.props} />
      </Segment>
    )
  }
}

