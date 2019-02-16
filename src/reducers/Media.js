import * as MediaActions from '../constants/MediaActions';

const defaultObj = {
  media: null
}


export default function mediaReducer(state = defaultObj, action ){
  switch (action.type) {
    case MediaActions.ADD_TO_PLAYLIST:
      return {
        ...action.payload
      }
    case MediaActions.LOAD_PLAYLIST:
      return {
        ...defaultObj
      }
    default:
      return { ...state };
  }
}
