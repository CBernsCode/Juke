import React, { Component } from 'react';
import _ from 'lodash';
// import { SearchBar } from 'react-native-elements';
import { Preview } from './Preview';
import { Button, Segment, Search, List, Image, Grid } from 'semantic-ui-react';
import "../css/index.css";

export default class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      results: [],
      value: "",
      selected_id: "",
    };
  }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({
    value: result.title,
    selected_id: result.id,
  })

  handleSearchChange = (e, { value }) => {
    this.setState({ value })
    // display search results while typing
    this.findTrack(value);
  };

  findTrack = (value) => {
    const { token } = this.props.media
    this.setState({ isLoading: true })
    var search = value.split(' ').join('+');

    // https://developer.spotify.com/documentation/web-api/reference/search/search/
    var url = "https://api.spotify.com/v1/search?q=" + search + "&type=track";
    fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error("Something went wrong...")
        }
      })
      .then(data => {
        console.log(data)
        let s_results = data.tracks.items;
        let tracks = []
        for (let i = 0; i < s_results.length; i++) {
          tracks[i] = {
            "key": s_results[i].id,
            "title": s_results[i].name,
            "description": s_results[i].artists[0].name,
            "image": s_results[i].album.images[0] ? s_results[i].album.images[0].url : "",
            "preview_url": s_results[i].preview_url ? s_results[i].preview_url : "",
          };
        }
        this.setState({
          results: tracks,
          isLoading: false,
        })
      })
      .catch(error => {
        this.setState({ error })
        console.log(error)
      });
  }

  listTrackItem = (tracks, index) => (
    <List.Item key={tracks.key}>
      <List.Content>
        <Preview id={index+ 'a'}
          preview_url={tracks.preview_url}
          preview_art={tracks.image} 
          selectedTrackId={tracks.key}
          inThePool={true} 
          selectFunc={this.props.mediaActions.saveSelectedTrackId} />
        <List.Header>
          {`"${tracks.title}"`} <br />
          {tracks.description} <br />
        </List.Header>
      </List.Content>
    </List.Item>
  )



  renderList = () => {
    return (
      <List id="search-results" inverted horizontal size="huge">
        {
          this.state.results
            .map((tracks, index) => {
              return this.listTrackItem(tracks, index)
            })
        }
      </List>
    )
  }

  render() {
    const { isLoading, value, results } = this.state

    // We can customize the way search results are displayed by messing with the
    // resultRenderer below. Otherwise, only "title" will be displayed.
    // This current solution is not very efficient, and does not look very good.
    // Preferably, we will have more real estate to display search results.
    // const resultRenderer = ({ title, description, image }) => //const resultRenderer = ({ title }) => <List content = {title}/>


    return (
      <Segment id="search-bar" inverted>
        <Grid>
          <Grid.Row>
          <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={10}>
              <Search
                fluid={true}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                // results={results}
                // resultRenderer={resultRenderer}
                value={value}
                open={false}
                // {...this.props}
              />
            </Grid.Column>
            {/* <Grid.Column width={6}>
              <Button
                fluid
                color="green"
                inverted
                onClick={() => this.findTrack(this.state.value)} >
                Search</Button>
            </Grid.Column> */}
          </Grid.Row>
        </Grid>
        {this.renderList()}
      </Segment>

    );
  }
}