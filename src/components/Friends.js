import React, { Component } from 'react'
import { Button, Icon, List, Segment } from 'semantic-ui-react'

export default class Friends extends Component {

  frienditem = friend => (
    <List.Item key={friend.id}>
      <List.Header className="friend-initial" as='h2'>{friend.name.slice(0,1)}</List.Header>
        <List.Header>{friend.name}</List.Header>
        Something else
        <Button inverted color='green' floated="right">
          {
            // This is a simple way to stub out two types of buttons.
            (Date.now() % 2 === 0)
              ? <Icon name='add circle' />
              : <Icon disabled name='check' />
          }
        </Button>
    </List.Item>
  )

  render = () => (
    <Segment id="friends" inverted >
      <List size={"large"}>
        {
          this.props.friends.map(friend => this.frienditem(friend))
        }
      </List>
    </Segment>
  )
}