import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from '../components/Layout';
import {
  AcctActions,
  MediaActions,
  SessionActions,
  FriendActions,
} from '../actions'

class App extends Component {
  render() {
    return (
     <Layout {...this.props}/>
    );
  }
}

const mapStateToProps = store => ({
  acct: store.acctReducer,
  media: store.mediaReducer,
  sesh: store.sessionReducer,
  friends: store.friendReducer.friendList,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  acctActions: bindActionCreators(AcctActions, dispatch),
  friendActions: bindActionCreators(FriendActions, dispatch),
  mediaActions: bindActionCreators(MediaActions, dispatch),
  sessionActions: bindActionCreators(SessionActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);



