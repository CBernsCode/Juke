import React, { Component } from 'react';
import _ from 'lodash';
// import { SearchBar } from 'react-native-elements';
import { Button, Segment, Search, List, Image } from 'semantic-ui-react';
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
        this.setState({ isLoading: true, value })    
        // this.findTrack(value);
    };

    findTrack = (value) => {
        const { token } = this.props.media
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
            for(let i = 0; i < s_results.length; i++) {
                tracks[i] = {
                    "key": s_results[i].id, 
                    "title": s_results[i].name, 
                    "description": s_results[i].artists[0].name,
                    "image": s_results[i].album.images[0] ? s_results[i].album.images[0].url : "",
                };
            }
            this.setState({ 
                isLoading: false,
                results: tracks
            })
            console.log(this.state.results)
        })
        .catch(error => {
            this.setState({ error })
            console.log(error)
        });
    }

    listTrackItem = (tracks) => (
        <List.Item key={tracks.key}>
          <Image src={tracks.image} />
          <List.Content>
            {/* {tracks.image} how to make this not display just the raw url? */}
            {tracks.title} <br />
            {tracks.description} <br />
          </List.Content>
        </List.Item>
      )

    render() {
        const { isLoading, value, results } = this.state

        // We can customize the way search results are displayed by messing with the
        // resultRenderer below. Otherwise, only "title" will be displayed.
        // This current solution is not very efficient, and does not look very good.
        // Preferably, we will have more real estate to display search results.
        const resultRenderer = ({ title, description, image }) => //const resultRenderer = ({ title }) => <List content = {title}/>
        <List id="search-results" divided inverted ordered>
            {
            this.state.results
                .map((tracks) => {
                    return this.listTrackItem(tracks)
                })
            }
        </List>

        return (
            <Segment id="search-bar" inverted>
                <Button
                    fluid
                    color="green"
                    inverted 
                    onClick={ () => this.findTrack(this.state.value) } >
                    Go
                </Button>
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    // resultRenderer={resultRenderer}
                    value={value}
                    {...this.props}
                />
            </Segment>

        );
    }
}