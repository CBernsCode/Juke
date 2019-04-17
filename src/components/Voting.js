import React, { Component } from 'react';
import { Preview } from './Preview'
import { Input, List, Segment, Button } from 'semantic-ui-react';
import { gameState } from '../reducers/Session';

import firebase from '../firebase';

let sampleData = [
  {
    artist: "Rush",
    name: "Working Man",
    id: "aababcb1223120"
  },
  {
    artist: "Rush",
    name: "Tom Sawyer",
    id: "aababcb1223121"
  },
  {
    artist: "Rush",
    name: "Freewill",
    id: "aababcb1223122"
  },
  {
    artist: "Rush",
    name: "Working Man",
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
      state: gameState.waiting,
    }
  }

  componentDidMount = () => {
    // this.getTrackInfo("44gbF5jrs7bljifR1X8ECK")
    // this.getSessionState()
    // this.addSongToVoting("4gEAYcaZPHpFFelzdt7pBX", 0)
    // this.addSongToVoting("1r5J8bYOWq1Dal5jMQ06WX", 1)
    // this.addSongToVoting("0DRAw7SODdYDqaInkjkS2v", 2) 
    // this.addSongToVoting("44gbF5jrs7bljifR1X8ECK", 3)
    // this.setWinner("cberns223")
    // this.getWinner()
    // this.determineWinningSong()
    const sessionId = this.props.sesh.session
    const { sessionActions } = this.props

    let key = "";
    if (sessionId) {
      key = sessionId
    } else {
      // TODO: no session work flow
      key = firebase.ref("/session").push({
        // chat: [{msg:"1", msg: "2"}],
        songs: sampleData,
        users: ["uid:123", "uid:124", "uid:125"]
      }).key
    }

    firebase.ref(`/session/${key}/state`).on('value', (snapshot) => {
      const newState = snapshot.val()
      console.log(newState)
      sessionActions.changeSessionState(newState)
      if(newState === gameState.waiting){
        this.determineWinningSong()
      }
    })

    firebase.ref(`/session/${key}/songs`).on('value', (snapshot) => {
      let snap = snapshot.val()
      this.setState({ songs: snap })
    })
  
    if(true){
      setTimeout(() => {
        firebase.ref(`/session/${key}/state`).set(gameState.waiting)
      }, 5000) 
    }
  }

  componentDidUpdate(prevProps) {
    const { session } = this.props.sesh
    // Typical usage (don't forget to compare props):
    if (session !== prevProps.sesh.session) {
      const { sessionActions } = this.props
      firebase.ref(`/session/${session}/state`).on('value', (snapshot) => {
        const newState = snapshot.val()
        console.log(newState)
        sessionActions.changeSessionState(newState)
        if(newState === gameState.waiting){
          this.determineWinningSong()
        }
      })
      
      firebase.ref(`/session/${session}/songs`).on('value', (snapshot) => {
        let snap = snapshot.val()
        this.setState({ songs: snap })
      })
    }
  }
  
  attachToSession = (token) => {
    const { sessionActions } = this.props
    firebase.ref(`/session/${token}/state`).on('value', (snapshot) => {
      const newState = snapshot.val()
      console.log(newState)
      sessionActions.changeSessionState(newState)
      if(newState === gameState.waiting){
        this.determineWinningSong()
      }
    })

    firebase.ref(`/session/${token}/songs`).on('value', (snapshot) => {
      let snap = snapshot.val()
      this.setState({ songs: snap })
    })
  }

  componentWillUnmount = () => {
    this.detachFromSession()
  }

  detachFromSession = () => {
    if (!!this.props.session && this.props.session.id) {
      try {
        firebase.ref(`/session/${this.props.sesh.session}/songs`).on('value', () => { })
        firebase.ref(`/session/${this.props.sesh.session}/state`).on('value', () => { })
      } catch (error) {
        throw Error("Was unable to detach from session ref")
      }
    }
  }

  addSongToVoting = (trackId, index) => {
    const { token } = this.props.media
    const { session } = this.props.sesh || "Error"
    // debugger
    if (!token || !session) return
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
        let preview_art = json.album.images[1].url
        var newSongRef = firebase.ref(`/session/${session}/songs/${index}`)
        newSongRef.set({
          name,
          trackId,
          preview_url,
          artist,
          preview_art,
        })
      })
  }

  handleMessage = (e, id) => {
    let { bids, pointBalance } = this.state
    let bid = e.target.value
    if (!!bid && bid > 0 && (pointBalance - bid > 0)) {
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
    const { session } = this.props.sesh

    bids.forEach((bid, index) => {
      const ref = firebase.ref(`/session/${session}/songs/${index}/bid/`).push()
      ref.set(Number(bid))
    })

    this.setState({
      bids: Array(this.state.songs.length).fill(0)
    })
  }

  getTrackInfo = (trackId, index) => {
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
        let preview_art = json.album.images[1].url
        return {
          name,
          trackId,
          preview_url,
          artist,
          preview_art,
        }
        // console.log({ name, preview_url, artist, preview_art })
      })
  }

  listItem = (song, index) => (
    <List.Item key={song.id}>
      <List.Content>
        <List.Header>
          <Preview id={index}
            preview_url={song.preview_url || ""}
            preview_art={song.preview_art || ""} />
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
    firebase.ref(`/session/${this.props.sesh.session}/songs`)
      .once('value')
      .then(snapshot => {
        let snap = snapshot.val()
        !!snap && snap.map(song => {
          let sum = 0;
          if (!!song.bid) {
            Object.keys(song.bid).forEach(key => {
              sum += Number(song.bid[key] || 0)
            })
            console.log(sum)
          }
        })
      })
  }

  getSessionState = () => {
    // for explicit checks
    firebase.ref(`/session/${this.props.sesh.session}/state`)
      .once('value')
      .then(snapshot => {
        let snap = snapshot.val()
        console.log(snap)
      })
  }

  getWinner = () => {
    firebase.ref(`/session/${this.props.sesh.session}/winner`)
      .once('value')
      .then(snapshot => {
        let snap = snapshot.val()
        console.log(snap)
      })
  }

  determineWinningSong = () => {
    let trackId = ""
    let highestBid = -1
    firebase.ref(`/session/${this.props.sesh.session}/songs`)
      .once('value')
      .then(snapshot => {
        let snap = snapshot.val()
        !!snap && snap.map(song => {
          let sum = 0;
          if (!!song.bid) {
            Object.keys(song.bid).forEach(key => {
              sum += Number(song.bid[key] || 0)
            })
          }
          if (sum > highestBid) {
            highestBid = sum
            trackId = song.trackId
          }
        })
        console.log(trackId)
      })
  }

  setWinner = (uid) => {
    firebase.ref(`/session/${this.props.sesh.session}/winner`).set(uid)
  }

  render() {
    return (
      <Segment inverted padded>
        <List id="voting-list" divided inverted ordered size="tiny">
          {
            this.state.songs
              .sort((a, b) => {
                return a.bid > b.bid ? -1 : a.bid < b.bid ? 1 : 0;
              })
              .map((song, i) => {
                return this.listItem(song, i)
              })
          }
        </List>
        <Button.Group fluid>
          <Button
            color="green"
            inverted
            onClick={() => this.handleSubmit()} >
            Bid
          </Button>
        </Button.Group>
      </Segment>
    )
  }
}

export default Voting;