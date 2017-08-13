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

const updateSearchResults = results => ({
  type: APP_ACTIONS.UPDATE_SEARCH_RESULTS,
  results,
});

export const handleQuerySubmit = (q = null) => (
  (dispatch, getState) => new Promise((resolve) => {
    let query = q;
    if (query === null) {
      query = getState().app.search.query;
    }
    if (query.length > 0) {
      SearchAPI.getSearchResults(query)
        .then((results) => {
          dispatch(updateSearchResults(results));
          resolve();
        })
        .catch();
    }
  })
);

export const enableServiceWorker = () => ({
  type: APP_ACTIONS.ENABLE_SERVICE_WORKER,
});

export const disableServiceWorker = () => ({
  type: APP_ACTIONS.DISABLE_SERVICE_WORKER,
});

export default () => {};
