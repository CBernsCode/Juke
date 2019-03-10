import React, { Component } from 'react'
import { auth, provider } from '../firebase.js';
import { Button, Grid } from 'semantic-ui-react'

export default class Topbar extends Component {

  constructor() {
    super()
    this.state = {
      name: ""
    }
  }


  logout = () => {
    let { acctActions } = this.props;
    auth.signOut().then(() => {
      acctActions.logout()
      this.setState({ name: "" });
    });
  }

  /**
  * @summary - The login function runs when the user click to login of the application.
  */
  login = () => {
    let { acctActions } = this.props;
    auth.signInWithPopup(provider).then((result) => {
      this.setState({ name: result.user.displayName });
      acctActions.login(result.user)
      console.log(result.user)
    });
  }

  loginBtn = () => {
    if (this.props.acct.displayName === "") {
      return (
        <Button onClick={() => this.login()} >Sign in</Button>
      )
    } else {
      return (
        <Button onClick={() => this.logout()} >{this.props.acct.displayName}</Button>
      )
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row as="Header"  className="App-header">
          <Grid.Column width={14}>
            <h1>Juke<span id="headline"> - Fight For Your Favorites</span></h1>
          </Grid.Column>
          <Grid.Column width={2}>
            <this.loginBtn />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
