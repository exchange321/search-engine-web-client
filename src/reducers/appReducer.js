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
    case APP_ACTIONS.TOGGLE_RESULTS_DISPLAY_MODE: {
      return {
        ...state,
        resDisMode: !state.resDisMode,
      };
    }
    case APP_ACTIONS.TOGGLE_NAV_DISPLAY_MODE: {
      return {
        ...state,
        navDisMode: !state.navDisMode,
      };
    }
    case APP_ACTIONS.ENABLE_EVALUATION_MODE: {
      return {
        ...state,
        evaluationMode: true,
      };
    }
    case APP_ACTIONS.DISABLE_EVALUATION_MODE: {
      return {
        ...state,
        evaluationMode: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default appReducer;
