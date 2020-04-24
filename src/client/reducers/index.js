import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
// general reducers:
import error from './error'
import options from './options'
import animation from './animation'
import leafletMap from './leafletMap'
// portal spefic reducers:
import clientSideFacetedSearch from './sampo/clientSideFacetedSearch'
import perspective1 from './sampo/perspective1'
import perspective2 from './sampo/perspective2'
import perspective3 from './sampo/perspective3'
import perspective1Facets from './sampo/perspective1Facets'
import perspective1FacetsConstrainSelf from './sampo/perspective1FacetsConstrainSelf'
import perspective2Facets from './sampo/perspective2Facets'
import perspective3Facets from './sampo/perspective3Facets'
import places from './sampo/places'

const reducer = combineReducers({
  perspective1,
  perspective2,
  perspective3,
  perspective1Facets,
  perspective1FacetsConstrainSelf,
  perspective2Facets,
  perspective3Facets,
  places,
  leafletMap,
  animation,
  options,
  error,
  clientSideFacetedSearch,
  toastr: toastrReducer
})

export default reducer
