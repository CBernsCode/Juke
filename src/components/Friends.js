import React from 'react'
import { Button, Image, List, Segment } from 'semantic-ui-react'

import Rachel from '../static/images/rachel.png'
import Matt from '../static/images/matthew.png'

const Friends = () => (

  <Segment id="friends" inverted>
    <List divided verticalAlign='middle'>
      <List.Item>
        <List.Content floated='right'>
          <Button>Add</Button>
        </List.Content>
        <Image avatar src={Rachel} />
        <List.Content>Lena</List.Content>
      </List.Item>
      <List.Item>
        <List.Content floated='right'>
          <Button>Add</Button>
        </List.Content>
        <Image avatar src={Matt} />
        <List.Content>Lindsay</List.Content>
      </List.Item>
      <List.Item>
        <List.Content floated='right'>
          <Button>Add</Button>
        </List.Content>
        <Image avatar src={Rachel} />
        <List.Content>Mark</List.Content>
      </List.Item>
      <List.Item>
        <List.Content floated='right'>
          <Button>Add</Button>
        </List.Content>
        <Image avatar src={Rachel} />
        <List.Content>Molly</List.Content>
      </List.Item>
    </List>
    <List id="confirmed-friends" relaxed='very'>
    <List.Item>
      <Image avatar src={Rachel} />
      <List.Content>
        <List.Header as='a'>Daniel Louise</List.Header>
        <List.Description>
          Last seen watching{' '}
          <a href="/">
            <b>Arrested Development</b>
          </a>{' '}
          just now.
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src={Matt} />
      <List.Content>
        <List.Header as='a'>Stevie Feliciano</List.Header>
        <List.Description>
          Last seen watching{' '}
          <a href="/">
            <b>Bob's Burgers</b>
          </a>{' '}
          10 hours ago.
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src={Matt} />
      <List.Content>
        <List.Header as='a'>Elliot Fu</List.Header>
        <List.Description>
          Last seen watching{' '}
          <a href="/">
            <b>The Godfather Part 2</b>
          </a>{' '}
          yesterday.
        </List.Description>
      </List.Content>
    </List.Item>
  </List>
  </Segment>
)

export default Friends