
import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import search from './search';
import error from './error';
import options from './options';

const reducer = combineReducers({
  options,
  search,
  error,
  toastr: toastrReducer,
});

export default reducer;
