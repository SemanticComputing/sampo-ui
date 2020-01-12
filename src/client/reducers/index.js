import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import error from './error'
import options from './options'
import manuscripts from './mmm/manuscripts'
import works from './mmm/works'
import events from './mmm/events'
import actors from './mmm/actors'
import places from './mmm/places'
import collections from './mmm/collections'
import expressions from './mmm/expressions'
import manuscriptsFacets from './mmm/manuscriptsFacets'
import manuscriptsFacetsConstrainSelf from './mmm/manuscriptsFacetsConstrainSelf'
import worksFacets from './mmm/worksFacets'
import eventsFacets from './mmm/eventsFacets'
import actorsFacets from './mmm/actorsFacets'
import placesFacets from './mmm/placesFacets'
import animation from './mmm/animation'
import clientSideFacetedSearch from './mmm/clientSideFacetedSearch'

const reducer = combineReducers({
  manuscripts,
  manuscriptsFacets,
  manuscriptsFacetsConstrainSelf,
  works,
  worksFacets,
  events,
  eventsFacets,
  actors,
  actorsFacets,
  places,
  placesFacets,
  collections,
  expressions,
  animation,
  options,
  error,
  clientSideFacetedSearch,
  toastr: toastrReducer
})

export default reducer
