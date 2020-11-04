import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET_VALUES,
  UPDATE_FACET_OPTION,
  CLEAR_FACET,
  CLEAR_ALL_FACETS
} from '../../actions'
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues,
  updateFacetOption,
  clearFacet
} from './helpers'

export const handleFacetAction = (state, action, initialState) => {
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
    case CLEAR_ALL_FACETS:
      return {
        ...initialState,
        facetUpdateID: ++state.facetUpdateID
      }
    default:
      return state
  }
}
