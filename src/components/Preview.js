import React, { useState } from 'react';
import { Button } from 'semantic-ui-react'

export const Preview = ({ id, preview_url, preview_art }) => {
  const [playing, setPlaying] = useState(false)
  return (
    <div 
      style={{ backgroundImage: `url(${preview_art})` }}
      className="voting-song-preview">
      <video id={id} className="preview" name="media">
        <source src={preview_url} type="audio/mpeg" />
      </video>
      <Button
        circular
        color='black'
        icon={playing ? 'pause' : 'play'}
        onClick={() => {
          if (playing) {
            let players = document.querySelectorAll('.preview')
            players.forEach(player => {
              player.pause()
            })
            document.getElementById(id).pause()
          } else {
            let players = document.querySelectorAll('.preview')
            players.forEach(player => {
              player.pause()
            })
            document.getElementById(id).play()
          }
          setPlaying(!playing)
        }}>
      </Button>
    </div>
  )
}