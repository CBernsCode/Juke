import { friendRef } from '../firebase'

import * as FriendActions from '../constants/FriendActions';

const loadFriends = (spotId) => {
  return (dispatch) => {
    friendRef.doc(spotId).collection('friends').get()
      .then((snap) => {
        let payload = [];
        snap.forEach((doc) => {
          payload.push({ id: doc.id, ...doc.data() })
        });
        dispatch({ type: FriendActions.LOAD_FRIENDS, payload })
      }).catch(err => console.error(err));
  }
}

const addFriend = (spotId, friend) => {
  debugger
  return dispatch => {
    const frndRef = friendRef.doc(spotId).collection('friends')
    frndRef.add(friend)

  }
}

export default {
  addFriend,
  loadFriends,
}