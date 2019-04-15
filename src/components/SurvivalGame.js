import React from "react";
import sketch from "../games/Survival";
import P5Wrapper from 'react-p5-wrapper';

export const SurvivalGame = () => (
  <P5Wrapper sketch={sketch}></P5Wrapper>
)