
import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {createResponsiveStateReducer} from 'redux-responsive';
import search from './search';
import error from './error';
import options from './options';
import map from './map';
import facet from './facet';

const reducer = combineReducers({
  options,
  search,
  map,
  facet,
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
