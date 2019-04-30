import * as AcctActions from '../constants/AccountActions';

const login = payload => {
  return { type: AcctActions.LOGIN, payload }
}

const logout = payload => {
  return { type: AcctActions.LOGOUT, payload }
}

export default {
  login,
  logout
}
