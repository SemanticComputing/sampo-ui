import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {createResponsiveStateReducer} from 'redux-responsive';
import manuscripts from './manuscripts';
import works from './works';
import people from './people';
import organizations from './organizations';
import places from './places';
import error from './error';
import manuscriptsFacets from './manuscriptsFacets';
import worksFacets from './worksFacets';
import peopleFacets from './peopleFacets';
import organizationsFacets from './organizationsFacets';
import placesFacets from './placesFacets';

const reducer = combineReducers({
  manuscripts,
  manuscriptsFacets,
  works,
  worksFacets,
  people,
  peopleFacets,
  organizations,
  organizationsFacets,
  places,
  placesFacets,
  error,
  toastr: toastrReducer,
  browser: createResponsiveStateReducer({
    extraSmall: 500,
    small: 700,
    medium: 1000,
    large: 1400,
    extraLarge: 1600,
  }),
});

export default reducer;
