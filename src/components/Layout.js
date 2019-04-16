import React, { Component } from 'react';
import { Grid, GridRow } from 'semantic-ui-react'
import {Topbar} from './Topbar';
import Player from './Player';
import RightPanel from './RightPanel';
import LoginModal from './LoginModal';

export default class Layout extends Component {
  render() {
    return (
      <>
        <Topbar />
        <Grid className="App" stackable padded="horizontally">
        <LoginModal {...this.props} />
          <Grid.Row>
            <Grid.Column width={6}>
              <Player {...this.props}/>
            </Grid.Column>
            <Grid.Column width={10}>
              <RightPanel {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}
