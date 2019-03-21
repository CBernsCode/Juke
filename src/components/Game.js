import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Jumper from './Jumper'

const GAME_STATUS = {
  notStated: "NOT_STARTED",
}

export default class Game extends Component{
  constructor(props){
    super(props);
    // You can initialize state properties here
    this.state = {
      gameStatus: GAME_STATUS.notStated
    }
  }
  render(){
    return (
      <Segment id="game" inverted>
        <Header as='h1' textAlign='center'>
        Game
        </Header>
       <Jumper />
      </Segment>
    )
  }
}

