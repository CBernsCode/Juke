import React, { Component } from 'react';
import { Image, Input, List, Segment } from 'semantic-ui-react';
import albumCover from '../static/images/albumTemp.png';

import firebase from '../firebase';

let sampleData = [
  {
    artist: "Rush",
    name: "Working Man",
    bid: 0,
    id: "aababcb1223120"
  },
  {
    artist: "Rush",
    name: "Tom Sawyer",
    bid: 0,
    id: "aababcb1223121"
  },
  {
    artist: "Rush",
    name: "Freewill",
    bid: 0,
    id: "aababcb1223122"
  },
  {
    artist: "Rush",
    name: "Working Man",
    bid: 0,
    id: "aababcb1223123"
  }
]

class Voting extends Component {

  constructor(props) {
    super(props)
    this.state = {
      songs: []
    }
  }

  componentDidMount = () => {
    let key = "";
    if (this.props.sessionKey) {
      key = this.props.sessionKey;
    } else {
      key = firebase.ref("/session").push({
        // chat: [{msg:"1", msg: "2"}],
        songs: sampleData,
        users: ["uid:123", "uid:124", "uid:125"]
      }).key
    }
    this.attachToSession(key)

    // firebase.ref("/session/").child(key).child("songs").on('value', (snapshot) => {
    //   let snap = snapshot.val()  
    //   console.log(snap)
    //   this.setState({songs: snap})
    // })
    this.props.sessionActions.startSession({ session: key })
  }

  componentWillUnmount = () => {
    this.detachFromSession()
  }

  attachToSession = (key) => {
    firebase.ref(`/session/${key}/songs`).on('value', (snapshot) => {
      let snap = snapshot.val()
      console.log(snap) // Log for debug
      this.setState({ songs: snap })
    })
  }

  detachFromSession = () => {
    if (!!this.props.session.id) {
      firebase.ref(`/session/${this.props.session.id}/songs`).on('value', () => { })
    }
  }

  listItem = (song) => (
    <List.Item key={song.id}>
      <List.Content>
        <List.Header>
          <Image size="tiny" src={albumCover} />
          <div className="song-info">
            {song.name} <br />
            {song.artist}
          </div>
        </List.Header>
        <Input className="bid-input" size="mini" placeholder='Bid' />
      </List.Content>
    </List.Item>
  )

  render() {
    return (
      <Segment inverted>
        <List id="voting-list" divided inverted ordered>
          {
            this.state.songs.map(song => {
              return this.listItem(song)
            })
          }
        </List>
      </Segment>
    )
  }
}

export default Voting;