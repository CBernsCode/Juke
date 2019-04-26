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

const loadPlaylistId = (payload) => {
  return {type: MediaActions.LOAD_PLAYLIST_ID, payload}
}

const saveNowPlayingId = (payload) => {
  return {type: MediaActions.SAVE_NOW_PLAYING_ID, payload}
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

const saveSelectedTrackId = (selectedTrackId) => {
  return { type: MediaActions.SAVE_SELECTED_TRACK_ID, payload: selectedTrackId }
}

const saveTempo = (tempo) => {
  return { type: MediaActions.SAVE_TEMPO, payload: tempo }
}

export const clearPlaylist = () => { 
  return { type: MediaActions.CLEAR_PLAYLIST }
}

export default {
  addToPlaylist,
  exportPlaylist,
  loadPlaylist,
  loadPlaylistId,
  saveNowPlayingId,
  fetchPlaylist,
  saveToken,
  saveUserId,
  saveSelectedTrackId,
  saveTempo,
  clearPlaylist,
}
