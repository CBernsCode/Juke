import React, { Component } from 'react';

import { Container, Segment } from 'semantic-ui-react';

import MusicSelect from './MusicSelect'

export default class Jumper extends Component {

  constructor(props) {
    super(props)
    this.state = {
      numPresses: 0,
      gameOver: false,
      time: 0,
    }
    this.timeOutHandle = window.setTimeout(() => { })
  }

  // // in the example above, assign the result
  // var timeoutHandle = window.setTimeout(...);

  // // in your click function, call clearTimeout
  // window.clearTimeout(timeoutHandle);

  // // then call setTimeout again to reset the timer
  // timeoutHandle = window.setTimeout(...);
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.timeOutHandle = window.setTimeout(() => {
      this.setState((state) => {
        return {
          gameOver: true,
        }
      })
    }, 5000)
  }

  handleKeyDown(e) {
    if (e.which === 32 && !this.state.gameOver) {
      e.preventDefault();
      this.setState((state) => {
        return {
          numPresses: state.numPresses + 1
        }
      })
      console.log('Space Bar!')
    }
  }

  reset = () => {
    window.focus(window)
    // window.clearTimeout(this.timeOutHandle);
    this.setState({ gameOver: false, numPresses: 0 })
    this.timeOutHandle = window.setTimeout(() => {
      this.setState((state) => {
        return {
          gameOver: true,
        }
      })
    }, 5000)
  }

  inProgress = () => (
    <Container textAlign='center' id="winner">
      <p>Press the Space Bar for 5s</p>
    </Container>
  )

  winner = () => (
    <Container textAlign='center' id="winner">
      <h2>Congrats You Won!</h2>
      <MusicSelect />
      <p>Game Over - Score: {this.state.numPresses}</p>
      <button onClick={() => this.reset()}> Reset </button>
    </Container>
  )

  render() {
    return (
      <Segment inverted >
        {
          this.state.gameOver
            ? <this.winner />
            : <Container textAlign='center'>
              <p>Press the Space Bar for 5s</p>
            </Container>
        }
      </Segment>
    )
  }
}
