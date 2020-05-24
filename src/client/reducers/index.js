import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
// general reducers:
import error from './error'
import options from './options'
import animation from './animation'
import leafletMap from './leafletMap'
// portal spefic reducers:
import fullTextSearch from './sampo/fullTextSearch'
import clientSideFacetedSearch from './sampo/clientSideFacetedSearch'
import perspective1 from './sampo/perspective1' // copy of manuscripts
import perspective2 from './sampo/perspective2' // copy of works
import perspective3 from './sampo/perspective3' // copy of events
import manuscripts from './sampo/manuscripts'
import works from './sampo/works'
import events from './sampo/events'
import actors from './sampo/actors'
import places from './sampo/places'
import expressions from './sampo/expressions'
import collections from './sampo/collections'
import perspective1Facets from './sampo/perspective1Facets'
import perspective1FacetsConstrainSelf from './sampo/perspective1FacetsConstrainSelf'
import perspective2Facets from './sampo/perspective2Facets'
import perspective3Facets from './sampo/perspective3Facets'

const reducer = combineReducers({
  perspective1,
  perspective2,
  perspective3,
  perspective1Facets,
  perspective1FacetsConstrainSelf,
  perspective2Facets,
  perspective3Facets,
  manuscripts,
  works,
  events,
  actors,
  expressions,
  collections,
  places,
  leafletMap,
  animation,
  options,
  error,
  clientSideFacetedSearch,
  fullTextSearch,
  toastr: toastrReducer
})

export default reducer
