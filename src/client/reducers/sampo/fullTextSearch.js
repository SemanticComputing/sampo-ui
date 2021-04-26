import {
  FETCH_FULL_TEXT_RESULTS,
  SORT_FULL_TEXT_RESULTS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../../actions'
import { orderBy } from 'lodash'

export const INITIAL_STATE = {
  query: '',
  results: [],
  sortBy: null,
  sortDirection: null,
  properties: [
    {
      id: 'prefLabel',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 400
    },
    {
      id: 'type',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 300
    }
  ],
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
      case SORT_FULL_TEXT_RESULTS: {
        let sortBy
        let sortDirection
        if (action.sortBy === state.sortBy) {
          sortBy = state.sortBy
          sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
        }
        if (action.sortBy !== state.sortBy) {
          sortBy = action.sortBy
          sortDirection = 'asc'
        }
        return {
          ...state,
          sortBy,
          sortDirection,
          results: orderBy(
            state.results,
            sortBy === 'prefLabel' ? 'prefLabel.prefLabel' : sortBy,
            sortDirection
          )
        }
      }
      default:
        return state
    }
  } else return state
}

export default fullTextSearch
