export const INITIAL_STATE = {
  query: '',
  datasets: ['warsa_karelian_places'],
  suggestions: [],
};

const search = (state = INITIAL_STATE, action) => {
  console.log(state, action);
  switch (action.type) {
    case 'UPDATE_QUERY':
      return { ...state, query: action.query || '' };
    case 'UPDATE_DATASETS':
      return { ...state, datasets: action.datasets || [] };
    case 'UPDATE_RESULTS':
      return { ...state, suggestions: action.results || [] };
    case 'CLEAR_RESULTS':
      return { ...state, suggestions: [] };
    default:
      return state;
  }
};

export default search;
