import { SEARCH_PAGE_ACTIONS } from './actionTypes';

import * as SearchAPI from '../api/search';

const updateSearchResults = (pages, results) => ({
  type: SEARCH_PAGE_ACTIONS.UPDATE_SEARCH_RESULTS,
  pages,
  results,
});

export const updateCurrentPage = (page = 1) => ({
  type: SEARCH_PAGE_ACTIONS.UPDATE_CURRENT_PAGE,
  page,
});

export const handleSearch = (q = null, p = 1) => (
  (dispatch, getState) => new Promise((resolve) => {
    let query = q;
    if (query === null) {
      query = getState().app.search.query;
    }
    const { resDisMode, navDisMode } = getState().app;
    if (query.length > 0) {
      SearchAPI.getSearchResults(query, navDisMode, resDisMode, p)
        .then(({ pages, results }) => {
          dispatch(updateSearchResults(pages, results));
          resolve();
        })
        .catch();
    }
  })
);

export default () => {};
