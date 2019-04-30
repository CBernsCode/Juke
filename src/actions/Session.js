import * as SessionAction from '../constants/SessionActions';
import { crntSessionRef } from '../firebase';
import { loadPlaylistId } from './Media';

const endSession = payload => {
  return { type: SessionAction.END_SESSION, payload }
}

const startSession = payload => {
  return { type: SessionAction.START_SESSION, payload }
}

const changeSessionState = payload => {
  return { type: SessionAction.CHANGE_STATE, payload }
}

const getCurrentSession = (uid) => {
  return dispatch => {
    crntSessionRef.doc(uid).get().then(it => {
      // console.log(it.data())
      // this should never actually fail, remove if needed 
      dispatch(startSession(it.data().session || null))
      dispatch(loadPlaylistId(it.data().playlist || "spotify:user:cberns223:playlist:6TYhr4OZQcYUlGx8RLGhuQ"))
    })
  }
}

const setCurrentSession = (uid, id) => {
  return dispatch => {
    crntSessionRef.doc(uid).set({ session: id }).then(() => {
      dispatch(startSession(id))
    })
  }
}

const addPoints = (points) => {
  return dispatch => {
    dispatch({ type: SessionAction.ADD_POINTS, payload: points })
  }
}

const spendPoints = (points) => {
  return dispatch => {
    dispatch({ type: SessionAction.SPEND_POINTS, payload: points })
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
