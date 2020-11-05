import {
  FETCH_FACET_CONSTRAIN_SELF,
  FETCH_FACET_CONSTRAIN_SELF_FAILED,
  UPDATE_FACET_VALUES_CONSTRAIN_SELF,
  CLEAR_ALL_FACETS
} from '../../actions'
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues
} from './helpers'

export const handleFacetConstrainSelfAction = (state, action, initialState) => {
  switch (action.type) {
    case FETCH_FACET_CONSTRAIN_SELF:
      return fetchFacet(state, action)
    case FETCH_FACET_CONSTRAIN_SELF_FAILED:
      return fetchFacetFailed(state, action)
    case UPDATE_FACET_VALUES_CONSTRAIN_SELF:
      return updateFacetValues(state, action)
    case CLEAR_ALL_FACETS:
      return {
        ...initialState,
        facetUpdateID: ++state.facetUpdateID
      }
    default:
      return state
  }
}
