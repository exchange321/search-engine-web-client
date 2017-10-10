import toastr from 'toastr';
import QueryString from 'query-string';
import { routerActions } from 'react-router-redux';
import { APP_ACTIONS } from './actionTypes';

import * as SearchAPI from '../api/search';

export const updateSearchSuggestions = suggestions => ({
  type: APP_ACTIONS.UPDATE_SEARCH_SUGGESTIONS,
  suggestions,
});

export const handleQueryChange = query => (
  (dispatch) => {
    dispatch({
      type: APP_ACTIONS.HANDLE_QUERY_CHANGE,
      query,
    });
    SearchAPI.getCompletions(query).then(suggestions => (
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
    const search = QueryString.parse(window.location.search);
    if (!getState().app.resDisMode) {
      search.p = search.p || 1;
    } else {
      delete search.p;
    }
    dispatch(routerActions.replace(`${window.location.pathname}?${QueryString.stringify(search)}`));
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
  }
);

export const enableEvaluationMode = () => ({
  type: APP_ACTIONS.ENABLE_EVALUATION_MODE,
});

export const disableEvaluationMode = () => ({
  type: APP_ACTIONS.DISABLE_EVALUATION_MODE,
});

export default () => {};
