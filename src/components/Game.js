import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react';

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
       <h1>Game</h1>
      </Segment>
    )
  }
}
