import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './appReducer';

const rootReducer = combineReducers(
  {
    app,
    router: routerReducer,
  },
);

export default rootReducer;
