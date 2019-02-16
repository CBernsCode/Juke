import * as AcctActions from '../constants/AccountActions';

const defaultObj = {
  acctName: "",
  uid: null,
}

export default function acctReducer(state = defaultObj, action) {
  switch (action.type) {
    case AcctActions.LOGIN:
      return {
        ...action.payload
      }
    case AcctActions.LOGOUT:
      return {
        ...defaultObj
      }
    default:
      return { ...state };
  }
}
