/**
 * Created by Wayuki on 11-Aug-17.
 */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import AppRoutes from './AppRoutes.jsx';

const store = configureStore();

const AppEntry = () => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

export default AppEntry;
