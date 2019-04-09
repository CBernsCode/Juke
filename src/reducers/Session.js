import * as SessionAction from '../constants/SessionActions';

const defaultObj = {
  session: "-Lc3L0FCx445toqccZWT"
}

export default function sessionReducer(state = defaultObj, action) {
  switch (action.type) {
    case SessionAction.END_SESSION:
      return {
        ...defaultObj
      }
    case SessionAction.START_SESSION:
      return {
        ...action.payload
      }
    default:
      return { ...state };
  }
}
