import React, { Component } from 'react'
import { TapBeat } from '../games/TabBeat';

export class TapGame extends Component {
    componentDidMount() {
        TapBeat()
    }

    componentWillUnmount() {
        const { sessionActions } = this.props

        let val = window.kill()
        sessionActions.addPoints(val);
    }

    render() {
        return (
            <div id="game"></div>
        )
    }
}
