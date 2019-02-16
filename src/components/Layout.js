import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react'
import Topbar from './Topbar';
import Game from './Game';
import Player from './Player';

export default class Layout extends Component {
  render() {
    return (
      <>
        <Topbar />
        <Grid className="App" celled stackable>
          <Grid.Row width={16}>

          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Player />
            </Grid.Column>
            <Grid.Column width={10}>
              <Game />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}
