
import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
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
});

export default reducer;
