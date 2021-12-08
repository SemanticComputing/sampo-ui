import {
  FETCH_FULL_TEXT_RESULTS,
  SORT_FULL_TEXT_RESULTS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../../actions'
import { orderBy } from 'lodash'

const handleFullTextSearchAction = (state, action, initialState) => {
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
      return initialState
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
}

export const createFullTextSearchReducer = (initialState, resultClass) => {
  const reducerFunc = (state = initialState, action) => {
    if (action.resultClass === resultClass) {
      return handleFullTextSearchAction(state, action, initialState)
    } else return state
  }
  return reducerFunc
}
