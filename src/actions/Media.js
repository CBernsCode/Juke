import * as MediaActions from '../constants/MediaActions';

const addToPlaylist = (payload) => {
  return {type: MediaActions.ADD_TO_PLAYLIST, payload}
}

const exportPlaylist = (payload) => {
  return {type: MediaActions.EXPORT_PLAYLIST, payload}
}

const loadPlaylist = (payload) => {
  return {type: MediaActions.LOAD_PLAYLIST, payload}
}

const fetchPlaylist = () => {
  let payload = {};
  return (dispath) => {
    dispath(loadPlaylist, payload)
  }
}

const saveToken = (token) => {
  return { type: MediaActions.SAVE_TOKEN, payload: token}
}

const saveUserId = (userId) => {
  return { type: MediaActions.SAVE_USER_ID, payload: userId }
}

export const clearPlaylist = () => { 
  return { type: MediaActions.CLEAR_PLAYLIST }
}

export default {
  addToPlaylist,
  exportPlaylist,
  loadPlaylist,
  fetchPlaylist,
  saveToken,
  saveUserId,
  clearPlaylist,
}
