import { createStore, combineReducers, applyMiddleware } from 'redux';
import acctReducer from './Account';
import mediaReducer from './Media';
import sessionReducer  from './Session';
import friendReducer from './Friends';

import thunk from 'redux-thunk';

const reducer = combineReducers({
  acctReducer,
  mediaReducer,
  sessionReducer,
  friendReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

export default store;
