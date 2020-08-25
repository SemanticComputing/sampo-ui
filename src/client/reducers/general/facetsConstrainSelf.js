import {
  FETCH_FACET_CONSTRAIN_SELF,
  FETCH_FACET_CONSTRAIN_SELF_FAILED,
  UPDATE_FACET_VALUES_CONSTRAIN_SELF
} from '../../actions'
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues
} from './helpers'

export const handleFacetConstrainSelfAction = (state, action) => {
  switch (action.type) {
    case FETCH_FACET_CONSTRAIN_SELF:
      return fetchFacet(state, action)
    case FETCH_FACET_CONSTRAIN_SELF_FAILED:
      return fetchFacetFailed(state, action)
    case UPDATE_FACET_VALUES_CONSTRAIN_SELF:
      return updateFacetValues(state, action)
    default:
      return state
  }
}
