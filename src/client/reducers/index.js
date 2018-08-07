
import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {createResponsiveStateReducer} from 'redux-responsive';
import search from './search';
import error from './error';
import options from './options';
import map from './map';

const reducer = combineReducers({
  options,
  search,
  map,
  error,
  toastr: toastrReducer,
  browser: createResponsiveStateReducer({
    extraSmall: 500,
    small: 700,
    medium: 1024,
    large: 1280,
    extraLarge: 1500,
  }),
});

export default reducer;
