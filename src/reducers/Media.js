import * as MediaActions from '../constants/MediaActions';

const defaultObj = {
  playlist: {},
  token: null,
  userId: "",
  selectedTrackId: "",
  tempo: 0,
}


export default function mediaReducer(state = defaultObj, action ){
  switch (action.type) {
    case MediaActions.ADD_TO_PLAYLIST:
      return {
        ...state,
        playlist: !!state.playlist && state.push(action.payload),
      }
    case MediaActions.LOAD_PLAYLIST:
      return {
        ...state,
        playlist: action.payload
      }
    case MediaActions.CLEAR_PLAYLIST:
      return {
        ...defaultObj,
        token: state.token,
      }
    case MediaActions.SAVE_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case MediaActions.SAVE_USER_ID:
      return {
        ...state,
        userId: action.payload
      }
    case MediaActions.SAVE_SELECTED_TRACK_ID:
      return {
        ...state,
        selectedTrackId: action.payload
      }
      case MediaActions.SAVE_TEMPO:
      return {
        ...state,
        tempo: action.payload
      }
    default:
      return { ...state };
  }
}
