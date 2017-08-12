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

export default () => {};
