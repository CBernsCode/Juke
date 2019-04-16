import * as FriendActions from '../constants/FriendActions';

const defaultObj = {
  friendList: []
}

export default function acctReducer(state = defaultObj, action) {
  switch (action.type) {
    case FriendActions.LOAD_FRIENDS:
      return {
        friendList: action.payload
      }
    default:
      return { ...state };
  }
}
