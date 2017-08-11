import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { history } from './store/configureStore';

import App from './components/App.jsx';

const AppRoutes = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route path="/:query?" component={App} />
    </Switch>
  </ConnectedRouter>
);

export default AppRoutes;
