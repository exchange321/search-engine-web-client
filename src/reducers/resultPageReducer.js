import initialState from './initialState';
import { RESULT_PAGE_ACTIONS } from '../actions/actionTypes';

const resultPageReducer = (state = initialState.resultPage, action) => {
  switch (action.type) {
    case RESULT_PAGE_ACTIONS.ADD_VISITED: {
      return {
        ...state,
        history: [...state.history, action.id],
      };
    }
    case RESULT_PAGE_ACTIONS.REVERT_HISTORY: {
      return {
        ...state,
        history: [...state.history.slice(0, state.history.length - action.num)],
      };
    }
    case RESULT_PAGE_ACTIONS.UPDATE_HISTORY: {
      return {
        ...state,
        history: action.history,
      };
    }
    case RESULT_PAGE_ACTIONS.RESET_HISTORY: {
      return {
        ...state,
        history: [],
        whitelist: [],
        blacklist: [],
      };
    }
    case RESULT_PAGE_ACTIONS.TOGGLE_FULL_SCREEN: {
      return {
        ...state,
        fullscreen: !state.fullscreen,
      };
    }
    case RESULT_PAGE_ACTIONS.EXIT_FULL_SCREEN: {
      return {
        ...state,
        fullscreen: false,
      };
    }
    case RESULT_PAGE_ACTIONS.REGISTER_WHITELIST: {
      return {
        ...state,
        whitelist: [...(new Set([...state.whitelist, action.id]))],
      };
    }
    case RESULT_PAGE_ACTIONS.REGISTER_BLACKLIST: {
      return {
        ...state,
        blacklist: [...(new Set([...state.blacklist, action.id]))],
      };
    }
    default: {
      return state;
    }
  }
};

export default resultPageReducer;
