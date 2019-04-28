import React, { Component } from 'react'
import { Button, Form, Header, Icon, List, Modal, Segment } from 'semantic-ui-react'

export default class Friends extends Component {
  constructor() {
    super()
    this.state = {
      uid: "",
      name: "",
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
      name: this.state.name || "",
      uid: this.state.uid || "",
      added: d.toLocaleDateString(),
    })
    this.setState({  modalOpen: false, uid: '', name: '' })
  }

  addFriendForm = () => {
    return (
      <Modal
        trigger={
          <Button inverted  fluid color="green" onClick={this.handleOpen}>
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
                label='User Name'
                placeholder='User Name' />
              <Form.Input
                onChange={this.handleChange}
                fluid
                name='uid'
                label='User ID'
                placeholder='User ID' />
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
        Added: {friend.added}
      </List.Item>
    )
  }
  render = () => (
    <Segment inverted >
      <h4>Add your friends to the session.</h4>
      <List id="friends" size={"large"}>
        {
          this.props.friends.map(friend => this.frienditem(friend))
        }
      </List>
      <this.addFriendForm />
    </Segment>
  )
}