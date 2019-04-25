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

export default class Voting extends Component {

  constructor(props) {
    super(props)
    this.state = {
      songs: [],
      bids: Array(4).fill(0),
      pointBalance: 1000,
    }
  }

  componentDidMount = () => {
    // Use these to seed if needed
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
    firebase.ref(`/session/${sessionId}/songs`).on('value', (snapshot) => {
      let snap = snapshot.val()
      if (!!snap) {
        let songs = snap.map((song, index) => {
          return {
            ...song,
            index,
            sum: !!song.bid ? function() {
              let sum  = 0;
              // debugger
              Object.keys(song.bid).forEach(key => {
                sum += Number(song.bid[key] || 0)
              })
              return sum

            }() : 0
          }
        })
        this.setState({ songs })
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { sesh } = this.props
    if (sesh.session !== prevProps.sesh.session) {
      firebase.ref(`/session/${sesh.session}/songs`).on('value', (snapshot) => {
        let snap = snapshot.val()
        if (!!snap) {
          this.setState({ songs: snap })
        }
      })
    }
  }

  sessionCreation = () => (
    <div>
      <Input
        value={this.state.session}
        onChange={e => {
          this.setState({ session: e.target.value });
        }}
        className="" size="mini" placeholder='Session' />
      <Button
        onClick={() => this.props.sessionActions.startSession(this.state.session)}>
        Go!
        </Button>
    </div>
  )

  componentWillUnmount = () => {
    this._isMounted = false;
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
    let { bids } = this.state
    let bid = e.target.value
    bids[id] = bid

    this.setState({
      bids,
    })
  }

  handleSubmit = () => {
    const { bids, pointBalance } = this.state
    const { session } = this.props.sesh

    // Check totals
    let total = 0
    bids.forEach(it => total += Number(it))


    if (total < pointBalance) {
      bids.forEach((bid, index) => {
        const ref = firebase.ref(`/session/${session}/songs/${index}/bid/`).push()
        ref.set(Number(bid))
      })
      this.setState({
        pointBalance: pointBalance - total,
        bids: Array(4).fill(0)
      })
    } else {
      alert("You are trying to spend points to don't have! Please adjust your bet.")
    }


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
            preview_art={song.preview_art || ""}
            song_id={song.id}
            inThePool={false}
            selectFunc={this.props.mediaActions.saveSelectedTrackId} />
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

  getSessionState = () => {
    // for explicit checks
    firebase.ref(`/session/${this.props.sesh.session}/state`)
      .once('value')
      .then(snapshot => {
        let snap = snapshot.val()
      })
  }

  getWinner = () => {
    firebase.ref(`/session/${this.props.sesh.session}/winner`)
      .once('value')
      .then(snapshot => {
        let snap = snapshot.val()
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
    const { sesh } = this.props
    return (
      <Segment inverted padded>
        {!sesh.session
          ? <this.sessionCreation />
          : <>
            <h4 id="point-total">You have: {this.state.pointBalance} Points</h4>
            <List id="voting-list" divided inverted ordered size="tiny">
              {
                this.state.songs
                  .sort((a, b) => {
                    return a.sum > b.sum ? -1 : a.sum < b.bsumid ? 1 : 0;
                  })
                  .map((song, i) => {
                    return this.listItem(song, song.index)
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
          </>
        }
      </Segment>
    )
  }
}