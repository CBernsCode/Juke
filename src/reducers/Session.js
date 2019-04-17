import * as SessionAction from '../constants/SessionActions';

export const gameState = {
  playing: "playing",
  waiting: "waiting"
}


const defaultObj = {
  // To-do make better default
  session: '-LcgCB2jMklsj-iYBcFV',
  status: gameState.waiting
}

export default function sessionReducer(state = defaultObj, action) {
  switch (action.type) {
    case SessionAction.END_SESSION:
      return {
        ...state,
        session: action.payload
      }
    case SessionAction.START_SESSION:
      return {
        ...state,
        session: action.payload
      }
    case SessionAction.CHANGE_STATE:
      return {
        ...state,
        status: action.payload
      }
    default:
      return { ...state };
  }
}
