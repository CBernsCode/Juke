import React, { Component } from 'react'
import { TapBeat } from '../games/TabBeat';

export class TapGame extends Component {
    componentDidMount() {
        TapBeat()
    }

    componentWillUnmount() {
        let tapScore = window.kill()
    }

    render() {
        return (
            <div id="game"></div>
        )
    }
}
