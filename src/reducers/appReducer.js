import initialState from './initialState';

const appReducer = (state = initialState.app, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default appReducer;
