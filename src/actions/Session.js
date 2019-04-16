import * as SessionAction from '../constants/SessionActions';

export const endSession = payload => {
  return { type: SessionAction.END_SESSION, payload }
}

export const startSession = payload =>  {
  return { type: SessionAction.START_SESSION, payload }
}

export const changeSessionState = payload => {
  return { type: SessionAction.CHANGE_STATE, payload }
}

export default {
  changeSessionState,
  endSession,
  startSession
}
