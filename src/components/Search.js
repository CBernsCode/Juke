import React, { Component } from 'react';
import _ from 'lodash';
// import { SearchBar } from 'react-native-elements';
import { Button, Segment, Search } from 'semantic-ui-react';
import "../css/index.css";  

export default class SearchBar extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false,
            results: [],
            value: "",
        };
    }
  
    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

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
                // console.log("track: ", s_results[i].name, " by ", s_results[i].artists[0].name, "\n")
                tracks[i] = {
                    "key": i, 
                    "title": s_results[i].name, 
                    "description": s_results[i].artists[0].name,
                    "image": s_results[i].album.images[0] ? s_results[i].album.images[0].url : "",
                    "id": s_results[i].id,
                };
            }
            this.setState({ 
                isLoading: false,
                results: tracks
            })
        })
        .catch(error => {
            this.setState({ error })
            console.log(error)
        });
    }

    render() {
        const { isLoading, value, results } = this.state

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
                    value={value}
                    {...this.props}
                />
            </Segment>

        );
    }
}