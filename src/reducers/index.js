
import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';
import search from './search';
import error from './error';

const reducer = combineReducers({
  search,
  error,
  toastr: toastrReducer,
});

export default reducer;
