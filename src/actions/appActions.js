import toastr from 'toastr';
import { APP_ACTIONS } from './actionTypes';

import * as SearchAPI from '../api/search';

export const updateSearchSuggestions = suggestions => ({
  type: APP_ACTIONS.UPDATE_SEARCH_SUGGESTIONS,
  suggestions,
});

export const handleQueryChange = query => (
  (dispatch, getState) => {
    dispatch({
      type: APP_ACTIONS.HANDLE_QUERY_CHANGE,
      query,
    });
    const { navDisMode } = getState().app;
    SearchAPI.getCompletions(query, navDisMode).then(suggestions => (
      dispatch(updateSearchSuggestions(suggestions))
    )).catch();
  }
);

export const triggerSearchState = () => ({
  type: APP_ACTIONS.TRIGGER_SEARCH_STATE,
});

export const toggleResDisMode = () => (
  (dispatch, getState) => {
    if ('localStorage' in window) {
      localStorage.setItem('resDisMode', (!getState().app.resDisMode).toString());
    }
    dispatch({
      type: APP_ACTIONS.TOGGLE_RESULTS_DISPLAY_MODE,
    });
    toastr.success('ResDisMode Switched!');
  }
);

export const toggleNavDisMode = () => (
  (dispatch, getState) => {
    if ('localStorage' in window) {
      localStorage.setItem('navDisMode', (!getState().app.navDisMode).toString());
    }
    dispatch({
      type: APP_ACTIONS.TOGGLE_NAV_DISPLAY_MODE,
    });
    toastr.success('NavDisMode Switched!');
    window.location.reload();
  });

export default () => {};
