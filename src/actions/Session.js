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

export const getCurrentSession = (uid) => {
  return dispatch => {
    crntSessionRef.doc(uid).get().then( it => {
      // console.log(it.data())
      // this should never actually fail, remove if needed 
      dispatch(startSession(it.data().session || null))
    })
  }
}

export const setCurrentSession = (uid, id) => {
  return dispatch => {
    crntSessionRef.doc(uid).set({session: id}).then(() => {
      dispatch(startSession(id))
    })
  }
}

export const addPoints = (points) => {
  return dispatch => {
    dispatch({type: SessionAction.ADD_POINTS , payload: points})
  }
}

export const spendPoints = (points) => {
  return dispatch => {
    dispatch({type: SessionAction.SPEND_POINTS , payload: points})
  }
}

export default {
  changeSessionState,
  setCurrentSession,
  endSession,
  getCurrentSession,
  startSession,
  addPoints,
  spendPoints,
}
