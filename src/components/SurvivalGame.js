import React, { Component } from 'react'
import sketch from "../games/Survival";
import P5Wrapper from 'react-p5-wrapper';

export class SurvivalGame extends Component {
  componentWillUnmount(){
    let val = window.kill()
    console.log(`Score from Survival Game: ${val}`)
  }

  render() {
    return (
      <P5Wrapper sketch={sketch}></P5Wrapper>
    )
  }
}