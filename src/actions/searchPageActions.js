import { SEARCH_PAGE_ACTIONS } from './actionTypes';

import * as SearchAPI from '../api/search';

const updateSearchResults = results => ({
  type: SEARCH_PAGE_ACTIONS.UPDATE_SEARCH_RESULTS,
  results,
});

export const handleSearch = (q = null) => (
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

export default () => {};
