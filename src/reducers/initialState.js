const initialState = {
  global: {
    sw: false,
  },
  app: {
    search: {
      query: '',
      triggered: false,
      suggestions: [],
    },
    searchResults: [],
  },
};

export default initialState;
