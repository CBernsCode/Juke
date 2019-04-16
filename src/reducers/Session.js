import * as SessionAction from '../constants/SessionActions';

export const gameState = {
  playing: "playing",
  winner: "winner",
  waiting: "waiting"
}


const defaultObj = {
  // To-do make better default
  session: "-Lc3L0FCx445toqccZWT",
  state: gameState.waiting
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
        state: action.payload
      }
    default:
      return { ...state };
  }
}
