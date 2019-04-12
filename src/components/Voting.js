import React, { Component } from 'react';
import {Preview} from './Preview'
import { Input, List, Segment, Button } from 'semantic-ui-react';

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
      songs: [],
      bids: [],
      pointBalance: 1000,
    }
  }

  componentDidMount = () => {
    const sessionId = this.props.sesh.session
    // debugger
    let key = "";
    if (sessionId) {
      key = sessionId
    } else {
      key = firebase.ref("/session").push({
        // chat: [{msg:"1", msg: "2"}],
        songs: sampleData,
        users: ["uid:123", "uid:124", "uid:125"]
      }).key
    }
    this.attachToSession(key)
    this.props.sessionActions.startSession({ session: key })
  }

  componentWillUnmount = () => {
    this.detachFromSession()
  }

  attachToSession = (token) => {
    firebase.ref(`/session/${token}/songs`).on('value', (snapshot) => {
      let snap = snapshot.val()
      this.setState({ songs: snap })
    })
  }

  detachFromSession = () => {
    if (!!this.props.session && this.props.session.id) {
      try {
        firebase.ref(`/session/${this.props.session.id}/songs`).on('value', () => { })
      } catch (error) {
        throw Error("Was unable to detach from session ref")
      }
    }
  }

  handleMessage = (e, id) => {
    let {bids, pointBalance } = this.state
    let bid = e.target.value
    if( !!bid && bid > 0 && (pointBalance - bid > 0)){
      bids[id] = bid
      pointBalance -= bid
      this.setState({
        bids,
        pointBalance,
      })
    } else {
      bids[id] = 0
      this.setState({
        bids,
      })
    }
    console.log(e.target.value + " " + id);
  }

  handleSubmit = () => {
    const { bids } = this.state

    bids.forEach((bid, index) => {
      firebase.ref(`/session/${this.props.sesh.session}/songs/${index}/bid/`).push(Number(bid));
      // newPostRef.set(bid)
    })

    this.setState({
      bids: Array(this.state.songs.length).fill(0)
    })
    this.getTotals()

    console.log("Submitted Bid!")
  }

  getTrackInfo = (trackId) => {
    const { token } = this.props.media
    fetch("https://api.spotify.com/v1/tracks/" + trackId, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(response => response.json())
    .then(json => {
      let artist = json.artists[0].name
      let { name, preview_url } = json

      console.log({ name, preview_url, artist})
    })
  }

  listItem = (song, index) => (
    <List.Item key={song.id}>
      <List.Content>
        <List.Header>
          <Preview id={index} 
            preview_url="https://p.scdn.co/mp3-preview/db700147f4ccde68e1134eda5a6761d6c7dacf24?cid=774b29d4f13844c495f206cafdad9c86" 
            preview_art="https://i.scdn.co/image/9809079115b43425658b228236a1332b25108aa1"/>    
          <div className="song-info">
            {song.name} <br />
            {song.artist}
          </div>
        </List.Header>
        <Input
          value={this.state.bids[index]}
          onChange={e => this.handleMessage(e, index)}
          className="bid-input" size="mini" placeholder='Bid' />
      </List.Content>
    </List.Item>
  )

  getTotals = () => {
    firebase.ref(`/session/${this.props.sesh.session}/songs`).once('value').then(snapshot => {
      let snap = snapshot.val()
      !!snap && snap.map( song => {
        let sum = 0;
        Object.keys(song.bid).forEach(key => {
          sum += Number(song.bid[key])
        })
        console.log(sum)
      })
    })
  }

  render() {
    this.getTrackInfo("44gbF5jrs7bljifR1X8ECK")
    return (
      <Segment inverted padded>

        <List id="voting-list" divided inverted ordered size="tiny">
          {
            this.state.songs
              .sort(function (a, b) { return a.bid > b.bid ? -1 : a.bid < b.bid ? 1 : 0; })
              .map((song, i )=> {
                return this.listItem(song, i)
              })
          }
        </List>
        <Button.Group fluid>
          <Button 
            color="green"
            inverted
            onClick={ () => this.handleSubmit()} >
            Bid
          </Button>

        </Button.Group>
      </Segment>
    )
  }
}

export default Voting;