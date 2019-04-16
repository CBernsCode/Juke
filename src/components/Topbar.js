import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import Brand from '../static/images/juke.svg'

export const Topbar = () => (
  <Header className="App-header" as='h1'>
    <Image id="img-brand" src={Brand} />
    <Header.Content>
      JUKE
    <Header.Subheader>Fight For Your Favorites</Header.Subheader>
    </Header.Content>
  </Header>
)

