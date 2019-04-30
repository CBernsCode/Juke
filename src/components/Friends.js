import React, { Component } from 'react'
import { Button, Form, Header, Icon, List, Modal, Segment } from 'semantic-ui-react'

export default class Friends extends Component {
  constructor() {
    super()
    this.state = {
      uid: '',
      name: '',
      note: '',
      modalOpen: false
    }
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleAddFriend = () => {
    const { friendActions, acct } = this.props
    let d = new Date()
    friendActions.addFriend(acct.uid, {
      name: this.state.name || '',
      uid: this.state.uid || 'anon',
      note: this.state.note || '',
      added: d.toLocaleDateString(),
    })
    this.setState({ modalOpen: false, uid: '', name: '', note: '' })
  }

  addFriendForm = () => {
    return (
      <Modal
        trigger={
          <Button inverted fluid color="green" onClick={this.handleOpen}>
            Add Friend
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'>
        <Header icon='plus' content='Add Friend' />
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Input
                onChange={this.handleChange}
                fluid
                name='name'
                label='Display Name'
                placeholder='Display Name' />
              <Form.Input
                onChange={this.handleChange}
                fluid
                name='uid'
                label='User ID'
                placeholder='User ID' />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input
                onChange={this.handleChange}
                fluid
                name='note'
                label='Note'
                placeholder='Note' />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose} inverted>
            <Icon name='cancel' /> Cancel
          </Button>
          <Button color='green' onClick={this.handleAddFriend} inverted>
            <Icon name='add' /> Add
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  frienditem = friend => {
    const { sessionActions, sesh } = this.props
    return (
      <List.Item key={friend.uid}>
        <List.Header className="friend-initial" as='h2'>{friend.name.slice(0, 1)}</List.Header>
        <Button
          onClick={() => sessionActions.setCurrentSession(friend.uid, sesh.session)}
          color='green' floated="right">
          <Icon name='add circle' />
        </Button>
        <List.Header>{friend.name}</List.Header>
        {friend.note}
      </List.Item>
    )
  }

  copySessiontoClip = () => {
    var copyText = document.getElementById("sesh-id");

    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  }

  render = () => {
    const { sesh } = this.props
    return (
      <Segment inverted >
          Add your friends to the session.
          <Button 
            content='Copy to Clipboard'
            icon="copy"
            style={{float: "right"}} 
            color='green' 
            onClick={this.copySessiontoClip} 
            inverted>
            {/* <Icon name='copy' /> */}
          </Button>
          <br />
        <List id="friends" size={"large"}>
          {
            this.props.friends.map(friend => this.frienditem(friend))
          }
        </List>
        <this.addFriendForm />
        <input type="text" stlye={{display: "none"}} value={sesh.session} id="sesh-id"></input>
        {/* <span id="sesh-id" stlye={{display: "none"}}>{sesh.session}</span> */}
      </Segment>
    )
  }
}