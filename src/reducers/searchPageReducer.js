import initialState from './initialState';
import { SEARCH_PAGE_ACTIONS } from '../actions/actionTypes';

const searchPageReducer = (state = initialState.searchPage, action) => {
  switch (action.type) {
    case SEARCH_PAGE_ACTIONS.UPDATE_SEARCH_RESULTS: {
      return {
        ...state,
        pages: action.pages,
        results: action.results,
      };
    }
    case SEARCH_PAGE_ACTIONS.UPDATE_CURRENT_PAGE: {
      return {
        ...state,
        currentPage: action.page,
      };
    }
    default: {
      return state;
    }
  }
};

export default searchPageReducer;
