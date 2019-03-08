import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {createResponsiveStateReducer} from 'redux-responsive';
import manuscripts from './manuscripts';
import people from './people';
import places from './places';
import error from './error';
import manuscriptsFacets from './manuscriptsFacets';
import peopleFacets from './peopleFacets';
import placesFacets from './placesFacets';

const reducer = combineReducers({
  manuscripts,
  manuscriptsFacets,
  people,
  peopleFacets,
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
