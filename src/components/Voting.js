import React, { Component } from 'react';
import { Preview } from './Preview'
import { Dropdown, Input, List, Segment, Button } from 'semantic-ui-react';
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
      creatingSession: false
    }
  }

  componentDidMount = () => {
    const { session } = this.props.sesh

    firebase.ref(`/session/${session}/songs`).on('value', (snapshot) => {
      let snap = snapshot.val()
      if (!!snap && Array.isArray(snap)) {
        let songs = snap.map((song, index) => {
          return {
            ...song,
            index,
            sum: !!song.bid ? function () {
              let sum = 0;
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
    const { sesh, sessionActions } = this.props

    if (sesh.status !== prevProps.sesh.status) {
      sessionActions.spendPoints(sesh.points);
      firebase.ref(`/session/${sesh.session}/songs`).once('value', (snapshot) => {
        let snap = snapshot.val()
        if (!!snap) {
          this.setState({ songs: snap })
        }
      })
    }

    if (sesh.session !== prevProps.sesh.session) {
      this.detachFromSession()
      firebase.ref(`/session/${sesh.session}/songs`).once('value', (snapshot) => {
        let snap = snapshot.val()
        if (!!snap) {
          this.setState({ songs: snap })
        }
      })
      firebase.ref(`/session/${sesh.session}/songs`).on('value', (snapshot) => {
        let snap = snapshot.val()
        if (!!snap) {
          this.setState({ songs: snap })
        }
      })
    }
  }



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

  handleMessage = (e, id) => {
    let { bids } = this.state
    let bid = e.target.value
    bids[id] = bid

    this.setState({
      bids,
    })
  }

  handleSubmit = () => {
    const { bids } = this.state
    const { sessionActions } = this.props
    const { points, session } = this.props.sesh

    // Calc total
    let total = 0
    bids.forEach(it => total += Number(it))

    // if we have enough points
    if (total <= points) {
      sessionActions.spendPoints(total);
      bids.forEach((bid, index) => {
        const ref = firebase.ref(`/session/${session}/songs/${index}/bid/`).push()
        if (index === 3) {
          ref.set(Number(bid))
          this.resyncList()
        } else {
          ref.set(Number(bid))
        }
      })
      this.setState({
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

  resyncList = () => {
    const { session } = this.props.sesh
    firebase.ref(`/session/${session}/songs`).once('value', (snapshot) => {
      let snap = snapshot.val()
      if (!!snap && Array.isArray(snap)) {
        let songs = snap.map((song, index) => {
          return {
            ...song,
            index,
            sum: !!song.bid ? function () {
              let sum = 0;
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

  startNewSession = () => {
    const { acct, media, mediaActions, sessionActions } = this.props
    const key = firebase.ref("/session").push({
      songs: [],
      state: "seeding",
      winner: "",
      runnerUp: acct.uid,
      host: acct.uid,
      users: [acct.uid],
      playlist: media.playlist_id

    }).key
    this.setState({ songs: [] })
    sessionActions.startSession(key)
    sessionActions.setCurrentSession(acct.uid, key)
    // mediaActions.loadPlaylistId(null)
    setTimeout(() => sessionActions.changeSessionState("seeding"), 500);

  }

  sessionCreation = () => (
    <Segment textAlign="center" inverted>
      <h3>Enter A Session ID</h3>
      <Input
        action={
          <Button
            onClick={() => {
              this.props.sessionActions.setCurrentSession(this.props.acct.uid, this.state.session)
              this.props.sessionActions.startSession(this.state.session)
            }}>
            Go!
          </Button>}
        type='text'
        onChange={e => {
          this.setState({ session: e.target.value });
        }}
        className="" size="mini" placeholder='Session' >
      </Input>
      <br />
      or
      <br />
      <Button onClick={() => this.startNewSession()}>Start New Session</Button>
    </Segment>
  )

  render() {
    const { sesh } = this.props
    return (
      <Segment inverted padded>
        {!sesh.session
          ? <this.sessionCreation />
          : <>
            <h4 id="point-total">
              You have: {this.props.sesh.points} Points
            </h4>
            <Dropdown item text='Options' style={{ float: "right", marginTop: "-1.5em" }}>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => this.props.sessionActions.startSession(null)}>
                  Leave Session
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.startNewSession()}>
                  Start New Session</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <hr />
            <List id="voting-list" divided inverted ordered size="tiny">
              {
                !!this.state.songs.sort && this.state.songs
                  .sort((a, b) => {
                    return a.sum > b.sum ? -1 : a.sum < b.sum ? 1 : 0;
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