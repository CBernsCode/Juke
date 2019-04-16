import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'

import Voting from './Voting'
import Friends from './Friends'
import Playlist from './Playlist'

export class Tabs extends Component {
  render() {
    let panes = [
      {
        menuItem: 'Game',
        render: () =>
          <Tab.Pane attached={false}>
            <Voting  {...this.props} />
          </Tab.Pane>
      },
      {
        menuItem: 'Playlist',
        render: () =>
          <Tab.Pane attached={false}>
            <Playlist {...this.props} />
          </Tab.Pane>
      },
      {
        menuItem: 'Friends',
        render: () =>
          <Tab.Pane attached={false}>
            <Friends {...this.props} />
          </Tab.Pane>
      },
    ]
    return (
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} padding={false} />
    )
  }
}

export default Tabs