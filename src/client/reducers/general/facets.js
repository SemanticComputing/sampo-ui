import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET_VALUES,
  UPDATE_FACET_OPTION,
  CLEAR_FACET
} from '../../actions'
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues,
  updateFacetOption,
  clearFacet
} from './helpers'

export const handleFacetAction = (state, action) => {
  switch (action.type) {
    case FETCH_FACET:
      return fetchFacet(state, action)
    case FETCH_FACET_FAILED:
      return fetchFacetFailed(state, action)
    case UPDATE_FACET_VALUES:
      return updateFacetValues(state, action)
    case UPDATE_FACET_OPTION:
      return updateFacetOption(state, action)
    case CLEAR_FACET:
      return clearFacet(state, action)
    default:
      return state
  }
}
