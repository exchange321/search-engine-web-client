import initialState from './initialState';
import { APP_ACTIONS } from '../actions/actionTypes';

const appReducer = (state = initialState.app, action) => {
  switch (action.type) {
    case APP_ACTIONS.HANDLE_QUERY_CHANGE: {
      return {
        ...state,
        search: {
          ...state.search,
          query: action.query,
        },
      };
    }
    case APP_ACTIONS.TRIGGER_SEARCH_STATE: {
      return {
        ...state,
        search: {
          ...state.search,
          triggered: true,
        },
      };
    }
    case APP_ACTIONS.UPDATE_SEARCH_SUGGESTIONS: {
      return {
        ...state,
        search: {
          ...state.search,
          suggestions: action.suggestions,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default appReducer;
