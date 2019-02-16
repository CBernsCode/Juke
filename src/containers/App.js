import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from '../components/Layout';
import {
  AcctActions,
  MediaActions,
  SessionActions
} from '../actions'

class App extends Component {
  render() {
    return (
     <Layout />
    );
  }
}

const mapStateToProps = store => ({
  acct: store.acctReducer,
  media: store.mediaReducer,
  sesh: store.sessionReducer,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  acctActions: bindActionCreators(AcctActions, dispatch),
  mediaActions: bindActionCreators(MediaActions, dispatch),
  seshActions: bindActionCreators(SessionActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);



