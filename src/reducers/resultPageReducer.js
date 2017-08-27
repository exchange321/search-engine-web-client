import initialState from './initialState';
import { RESULT_PAGE_ACTIONS } from '../actions/actionTypes';

const resultPageReducer = (state = initialState.resultPage, action) => {
  switch (action.type) {
    case RESULT_PAGE_ACTIONS.ADD_VISITED: {
      const history = [...state.history, action.id];
      return {
        ...state,
        visited: new Set(history),
        history,
      };
    }
    case RESULT_PAGE_ACTIONS.REVERT_HISTORY: {
      const history = [...state.history.slice(0, state.history.length - action.num)];
      return {
        ...state,
        visited: new Set(history),
        history,
      };
    }
    case RESULT_PAGE_ACTIONS.UPDATE_HISTORY: {
      return {
        ...state,
        history: action.history,
        visited: new Set(action.history),
      };
    }
    case RESULT_PAGE_ACTIONS.RESET_HISTORY: {
      return {
        ...state,
        history: initialState.resultPage.history,
        visited: new Set(initialState.resultPage.history),
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
    default: {
      return state;
    }
  }
};

export default resultPageReducer;
