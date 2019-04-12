import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'
import {Topbar} from './Topbar';
import Game from './Game';
import Player from './Player';

export default class Layout extends Component {
  render() {
    return (
      <>
        <Topbar />
        <Grid className="App" stackable padded="horizontally">
          <Grid.Row>
            <Grid.Column width={6}>
              <Player {...this.props}/>
            </Grid.Column>
            <Grid.Column width={10}>
              <Game {...this.props}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}
