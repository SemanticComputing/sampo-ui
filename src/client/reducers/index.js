import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import error from './error';
import options from './options';
import manuscripts from './mmm/manuscripts';
import works from './mmm/works';
import events from './mmm/events';
import actors from './mmm/actors';
import places from './mmm/places';
import collections from './mmm/collections';
import expressions from './mmm/expressions';
import manuscriptsFacets from './mmm/manuscriptsFacets';
import manuscriptsFacetsConstrainSelf from './mmm/manuscriptsFacetsConstrainSelf';
import worksFacets from './mmm/worksFacets';
import eventsFacets from './mmm/eventsFacets';
import actorsFacets from './mmm/actorsFacets';
import placesFacets from './mmm/placesFacets';
import clientSideFacetedSearch from './mmm/clientSideFacetedSearch';
import animation from './mmm/animation';

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
  clientSideFacetedSearch,
  animation,
  options,
  error,
  toastr: toastrReducer,
  // browser: createResponsiveStateReducer({
  //   extraSmall: 500,
  //   small: 700,
  //   medium: 1000,
  //   large: 1400,
  //   extraLarge: 1600,
  // }),
});

export default reducer;
