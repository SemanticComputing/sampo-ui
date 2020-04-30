import {
  FETCH_FULL_TEXT_RESULTS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../../actions'

export const INITIAL_STATE = {
  query: '',
  results: null,
  fetching: false
}

const fullTextSearch = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'fullText') {
    switch (action.type) {
      case FETCH_FULL_TEXT_RESULTS:
        return {
          ...state,
          fetching: true
        }
      case UPDATE_RESULTS:
        return {
          ...state,
          query: action.query,
          results: action.data,
          fetching: false
        }
      case CLEAR_RESULTS:
        return INITIAL_STATE
      default:
        return state
    }
  } else return state
}

export default fullTextSearch
