import * as SessionAction from '../constants/SessionActions';
import { crntSessionRef } from '../firebase';

export const endSession = payload => {
  return { type: SessionAction.END_SESSION, payload }
}

export const startSession = payload =>  {
  return { type: SessionAction.START_SESSION, payload }
}

export const changeSessionState = payload => {
  return { type: SessionAction.CHANGE_STATE, payload }
}

export const getCurrentSession = (id) => {
  return dispatch => {
    crntSessionRef.doc(id).get().then( it => {
      console.log(it.data())
      // this should never actualyl fail, remove || if needed 
      dispatch(startSession(it.data().session || null))
    })
  }
}

export default {
  changeSessionState,
  endSession,
  getCurrentSession,
  startSession
}
