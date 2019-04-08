import React from 'react'
import { Tab } from 'semantic-ui-react'

import Voting from './Voting'
import Friends from './Friends'
import Playlist from './Playlist'


const Tabs = ({ sessionActions }) => {
  let panes = [
    {
      menuItem: 'Game', render: () =>
        <Tab.Pane attached={false}>
          <Voting sessionKey="-L_cQLs_JHhrMruoZBI3" sessionActions={sessionActions} />
        </Tab.Pane>
    },
    {
      menuItem: 'Playlist', render: () =>
        <Tab.Pane attached={false}>
          <Playlist />
        </Tab.Pane>
    },
    {
      menuItem: 'Friends', render: () =>
        <Tab.Pane attached={false}>
          <Friends />
        </Tab.Pane>
    },
  ]

  return <Tab menu={{ secondary: true, pointing: true }} panes={panes} inverted />
}

export default Tabs