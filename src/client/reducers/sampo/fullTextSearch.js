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
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 300
    },
    {
      id: 'note',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 400,
      collapsedMaxWords: 4
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
        const sortByProperty = state.properties.find(property => property.id === sortBy)
        const sortByPath = sortByProperty.valueType === 'object' ? `${sortBy}.prefLabel` : sortBy
        return {
          ...state,
          sortBy,
          sortDirection,
          results: orderBy(
            state.results,
            sortByPath,
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
