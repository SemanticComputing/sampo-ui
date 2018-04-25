export const INITIAL_STATE = {
  query: '',
  datasets: [],
  suggestions: [],
};

const search = (state = INITIAL_STATE, action) => {
  // console.log(state, action);
  switch (action.type) {
    case 'UPDATE_QUERY':
      return { ...state, query: action.query };
    case 'UPDATE_DATASETS':
      return { ...state, datasets: action.datasets };
    default:
      return state;
  }
};

export default search;
