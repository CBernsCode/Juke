import * as AcctActions from '../constants/AccountActions';

export const login = payload => {
  return { type: AcctActions.LOGIN, payload }
}

export const logout = payload => {
  return { type: AcctActions.LOGOUT, payload }
}

export default {
  login,
  logout
}
