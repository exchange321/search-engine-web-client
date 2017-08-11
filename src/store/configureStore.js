import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'react-router-redux';

import createHistory from 'history/createBrowserHistory';

import rootReducer from '../reducers';

export const history = createHistory();

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk, reduxPromiseMiddleware(), routerMiddleware(history)),
);

const configureStore = initialState => (
  createStore(
    rootReducer,
    initialState,
    enhancer,
  )
);

export default configureStore;
