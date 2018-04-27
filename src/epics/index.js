import 'rxjs';
import _ from 'lodash';
import { ajax } from 'rxjs/observable/dom/ajax';
import { combineEpics } from 'redux-observable';
import { updateSuggestions, FETCH_SUGGESTIONS } from '../actions';

const getSuggestionsEpic = (action$, store) => {
  const searchUrl = 'http://localhost:3000/search';

  return action$.ofType(FETCH_SUGGESTIONS)
    .debounceTime(500)
    .switchMap(() => {
      const { query, datasets } = store.getState().search;
      if (query.length < 3) {
        return [];
      }
      const dsParams = _.map(datasets, ds => `dataset=${ds}`).join('&');

      const requestUrl = `${searchUrl}?q=${query}&${dsParams}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateSuggestions(response));
    });
};

const rootEpic = combineEpics(getSuggestionsEpic);

export default rootEpic;
