import React, { Component } from 'react'
import { Button, Image, List, Segment } from 'semantic-ui-react'

import Rachel from '../static/images/rachel.png'
import Matt from '../static/images/matthew.png'

const testFriend = {
  id: "Test-id",
  name: "Some Name",
  ts: Date.now(),
}

export default class Friends extends Component {

  // async componentDidMount() {
  //   const { friendActions, acctActions } = this.props
  //   const { token } = this.props.media
  //   fetch("https://api.spotify.com/v1/me", {
  //     method: "GET",
  //     headers: {
  //       authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(doc => doc.json())
  //     .then(profile => {
  //       // add some test friends
  //       // friendActions.addFriend(profile.id, testFriend)
  //       // friendActions.addFriend(profile.id, testFriend)
  //       // friendActions.addFriend(profile.id, testFriend)
  //       // friendActions.addFriend(profile.id, testFriend)
  //       // friendActions.addFriend(profile.id, testFriend)
  //       // friendActions.addFriend(profile.id, testFriend)
  //       friendActions.loadFriends(profile.id)
  //       acctActions.login({
  //         displayName: profile.display_name,
  //         uid: profile.id,
  //       })
  //       console.log(profile)
  //     })
  // }

  frienditem = friend => (
    <List.Item key={friend.id}>
      <List.Header className="friend-initial" as='h2'>{friend.name.slice(0,1)}</List.Header>
      <List.Content>
        <List.Description>
        {friend.name} <br />
        Something else
        </List.Description>
      </List.Content>
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