const initialState = {
  app: {
    search: {
      query: '',
      triggered: false,
      suggestions: [],
    },
    searchResults: {
      sw: false,
      results: [],
    },
  },
};

export default initialState;
