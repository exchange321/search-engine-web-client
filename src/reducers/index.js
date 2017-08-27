import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './appReducer';
import searchPage from './searchPageReducer';
import resultPage from './resultPageReducer';

const rootReducer = combineReducers(
  {
    app,
    searchPage,
    resultPage,
    router: routerReducer,
  },
);

export default rootReducer;
