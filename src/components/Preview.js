import React, { useState } from 'react';
import { Button } from 'semantic-ui-react'

export const Preview = ({ id, preview_url, preview_art }) => {
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <video id={id} className="preview" name="media">
        <source src={preview_url} type="audio/mpeg" />
      </video>
      <Button
        className="voting-song-preview"
        style={{ backgroundImage: `url(${preview_art})` }}
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
    </>
  )
}