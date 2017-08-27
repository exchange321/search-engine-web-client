import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { history } from './store/configureStore';

import App from './components/App.jsx';

const AppRoutes = () => (
  <ConnectedRouter history={history}>
    <Route component={App} />
  </ConnectedRouter>
);

export default AppRoutes;
