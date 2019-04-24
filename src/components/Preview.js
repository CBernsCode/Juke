import React, { useState } from 'react';
import { Button, Popup, Grid } from 'semantic-ui-react'

export const Preview = ({ id, preview_url, preview_art, selectedTrackId, inThePool, props }) => {
  const [playing, setPlaying] = useState(false)
  const hasPreview = (preview_url !== "")

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
          { hasPreview && 
            <Popup trigger={
              <Button
                id="previewButton"
                circular
                color='black'
                icon={playing ? 'pause' : 'play'}
                onClick={() => {
                  // TODO
                  // reset all preview icons 
                  
                  // pause all other previews
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
          }
          { !hasPreview && 
            <Popup trigger={
              <Button
                circular
                color='black'
                icon="close"
                onClick={() => {return}}>
              </Button>
            }
            content="No Preview Available" />
          }
          { inThePool && 
            <Popup trigger={
              <Button
                circular
                color='black'
                icon={'add'}
                onClick={() => { 
                  props.mediaActions.saveSelectedTrackId(selectedTrackId) }}
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