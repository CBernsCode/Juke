import React, { Component } from 'react'

export default class Player extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div id="media">
        <iframe src="https://open.spotify.com/embed/user/nsqx6avzxhybkmfumqb1juwmn/playlist/5OJs7eATLrvZ2Ea9als3lK" width="100%" height="200" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    )
  }
}
