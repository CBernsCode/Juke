import React, { Component } from 'react'
import sketch from "../games/Survival";
import P5Wrapper from 'react-p5-wrapper';

export class SurvivalGame extends Component {
  componentWillUnmount(){
    window.kill()
  }

  render() {
    return (
      <P5Wrapper sketch={sketch}></P5Wrapper>
    )
  }
}