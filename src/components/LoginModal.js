import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { authEndpoint, clientId, redirectUri, scopes } from "../constants/Config";

export default class LoginModal extends Component {
  state = { modalOpen: true }

  handleOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleClose = () => {
    const { uid } = this.props.acct
    if (!uid) 
      return
    else 
      this.setState({ modalOpen: false })
  }

  render() {
    const { uid } = this.props.acct
    return (
      <Modal
        open={this.state.modalOpen && uid === null}
        onClose={this.handleClose}
        basic
        size='small'
        defaultOpen={true}
      >
        <Modal.Content>
          <h1>Juke</h1>
          <h2>Fight For Your Favorites</h2>
          <h3>To continue, please log into Spotify.</h3>
          <Button
            color="green"
            size="huge"
            inverted
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}>
            Login
          </Button>
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
      </Modal>
    )
  }
}