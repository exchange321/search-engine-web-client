import { combineReducers } from 'redux';

import global from './globalReducer';
import app from './appReducer';

const rootReducer = combineReducers(
  {
    global,
    app,
  },
);

export default rootReducer;
