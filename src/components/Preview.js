import React, { useState } from 'react';
import { Button, Popup, Grid } from 'semantic-ui-react'

export const Preview = ({ id, preview_url, preview_art, selectedTrackId, inThePool, selectFunc }) => {
  const [playing, setPlaying] = useState(false)
  return (
    <div
      style={{ backgroundImage: `url(${preview_art})` }}
      className="voting-song-preview">
      <video id={id} className="preview" name="media">
        <source src={preview_url} type="audio/mpeg" />
      </video>
      <Grid>
        <Grid.Column width={10}>
          <Button.Group icon>
            <Popup trigger={
              <Button
                circular
                color='black'
                icon={playing ? 'pause' : 'play'}
                onClick={() => {
                  let players = document.querySelectorAll('.preview')
                  players.forEach(player => {
                    player.pause()
                  })

                  if (playing) {
                    document.getElementById(id).pause()
                  } else {
                    document.getElementById(id).play()
                  }
                  setPlaying(!playing)
                }}>
              </Button>
            }
              content="Preview" />
            {inThePool &&
              <Popup trigger={
                <Button
                  circular
                  color='black'
                  icon={'add'}
                  onClick={() => { selectFunc(selectedTrackId) }}
                >
                </Button>
              }
                content="Add" />
            }
          </Button.Group>
        </Grid.Column>
      </Grid>
    </div>
  )
}