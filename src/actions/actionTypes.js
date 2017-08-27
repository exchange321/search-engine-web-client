export const APP_ACTIONS = {
  HANDLE_QUERY_CHANGE: 'HANDLE_APP_PAGE_SEARCH_QUERY_CHANGE',
  TRIGGER_SEARCH_STATE: 'TRIGGER_APP_PAGE_SEARCH_STATE',
  UPDATE_SEARCH_SUGGESTIONS: 'UPDATE_APP_PAGE_SEARCH_SUGGESTIONS',
  TOGGLE_RESULTS_DISPLAY_MODE: 'TOGGLE_APP_PAGE_RESULTS_DISPLAY_MODE',
  TOGGLE_NAV_DISPLAY_MODE: 'TOGGLE_APP_PAGE_NAV_DISPLAY_MODE',
};

export const SEARCH_PAGE_ACTIONS = {
  UPDATE_SEARCH_RESULTS: 'UPDATE_SEARCH_PAGE_SEARCH_RESULTS',
};

export const RESULT_PAGE_ACTIONS = {
  ADD_VISITED: 'ADD_VISITED_WEBPAGE_TO_RESULT_PAGE',
  REVERT_HISTORY: 'REVERT_RESULT_PAGE_RESULT_HISTORY',
  UPDATE_HISTORY: 'UPDATE_RESULT_PAGE_RESULT_HISTORY',
  RESET_HISTORY: 'RESET_RESULT_PAGE_RESULT_HISTORY',
  TOGGLE_FULL_SCREEN: 'TOGGLE_RESULT_PAGE_RESULT_FULL_SCREEN',
  EXIT_FULL_SCREEN: 'EXIT_RESULT_PAGE_RESULT_FULL_SCREEN',
};

export default {};
