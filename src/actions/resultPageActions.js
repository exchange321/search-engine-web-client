import { RESULT_PAGE_ACTIONS } from './actionTypes';

export const addVisited = id => ({
  type: RESULT_PAGE_ACTIONS.ADD_VISITED,
  id,
});

export const revertHistory = (num = 1) => ({
  type: RESULT_PAGE_ACTIONS.REVERT_HISTORY,
  num,
});

export const updateHistory = history => ({
  type: RESULT_PAGE_ACTIONS.UPDATE_HISTORY,
  history,
});

export const resetHistory = () => ({
  type: RESULT_PAGE_ACTIONS.RESET_HISTORY,
});

export const toggleFullScreen = () => ({
  type: RESULT_PAGE_ACTIONS.TOGGLE_FULL_SCREEN,
});

export const exitFullScreen = () => ({
  type: RESULT_PAGE_ACTIONS.EXIT_FULL_SCREEN,
});

export const registerWhitelist = id => ({
  type: RESULT_PAGE_ACTIONS.REGISTER_WHITELIST,
  id,
});

export const registerBlacklist = id => ({
  type: RESULT_PAGE_ACTIONS.REGISTER_BLACKLIST,
  id,
});

export default () => {};
