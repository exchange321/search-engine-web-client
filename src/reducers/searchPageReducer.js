import initialState from './initialState';
import { SEARCH_PAGE_ACTIONS } from '../actions/actionTypes';

const searchPageReducer = (state = initialState.searchPage, action) => {
  switch (action.type) {
    case SEARCH_PAGE_ACTIONS.UPDATE_SEARCH_RESULTS: {
      return {
        ...state,
        results: action.results,
      };
    }
    default: {
      return state;
    }
  }
};

export default searchPageReducer;
