import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'
import Topbar from './Topbar';
import Game from './Game';
import Player from './Player';
import Voting from './Voting';

export default class Layout extends Component {
  render() {
    let {acctActions, acct, sessionActions} = this.props
    return (
      <>
        <Topbar acctActions={acctActions} acct={acct} />
        <Grid className="App" stackable padded="horizontally">
          {/* <Grid.Row width={16}>
          </Grid.Row> */}
          <Grid.Row>
            <Grid.Column width={6}>
              <Player />
              <Voting sessionKey="-L_cQLs_JHhrMruoZBI3" sessionActions={sessionActions}/>
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
