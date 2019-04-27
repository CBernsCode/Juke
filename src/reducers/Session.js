import * as SessionAction from '../constants/SessionActions';

export const gameState = {
  playing: "playing",
  waiting: "waiting",
  winner: "winner"
}


const defaultObj = {
  // To-do make better default
  session: '-LcgCB2jMklsj-iYBcFV',
  status: gameState.waiting,
  points: 0,
}

export default function sessionReducer(state = defaultObj, action) {
  switch (action.type) {
    case SessionAction.END_SESSION:
      return {
        ...state,
        session: action.payload,
      }
    case SessionAction.START_SESSION:
      return {
        ...state,
        session: action.payload,
      }
    case SessionAction.CHANGE_STATE:
      return {
        ...state,
        status: action.payload,
      }
    case SessionAction.ADD_POINTS:
      return {
        ...state,
        points: state.points + action.payload,
      }
    case SessionAction.SPEND_POINTS:
      return {
        ...state,
        points: state.points - action.payload,
      }
    default:
      return { ...state };
  }
}
