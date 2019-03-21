import React, { Component } from 'react';
import {Container, Image, Input, List } from 'semantic-ui-react';
import albumCover from '../static/images/albumTemp.png';

export default class MusicSelect extends Component {
  render() {
    return (
      <Container textAlign='center'>
        <h2>Now, Find your Favorites!</h2>
        <Input icon='search' placeholder='Search...' /><br/><hr />
        <List horizontal>
          <List.Item>
            <Image src={albumCover} />
            <List.Content>
              <List.Header>Song #1</List.Header>
              Song #1
            </List.Content>
          </List.Item>
          <List.Item>
            <Image src={albumCover} />
            <List.Content>
              <List.Header>Song #2</List.Header>
              Song #2
            </List.Content>
          </List.Item>
          <List.Item>
            <Image src={albumCover} />
            <List.Content>
              <List.Header>Song #3</List.Header>
              Song #3
            </List.Content>
          </List.Item>
        </List>
      </Container>
    )
  }
}