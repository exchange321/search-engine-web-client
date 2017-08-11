import initialState from './initialState';

const globalReducer = (state = initialState.global, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default globalReducer;
