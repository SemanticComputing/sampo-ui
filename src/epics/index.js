import 'rxjs';
import _ from 'lodash';
import { ajax } from 'rxjs/observable/dom/ajax';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { updateSuggestions, FETCH_SUGGESTIONS, FETCH_SUGGESTIONS_FAILED } from '../actions';

const getSuggestionsEpic = (action$, store) => {
  const searchUrl = 'http://localhost:3000/search';

  return action$.ofType(FETCH_SUGGESTIONS)
    .debounceTime(500)
    .switchMap(() => {
      const { query, datasets } = store.getState().search;
      const language = store.getState().options.language;
      if (query.length < 3) {
        return [];
      }
      const dsParams = _.map(datasets, ds => `dataset=${ds}`).join('&');

      const requestUrl = `${searchUrl}?q=${query}&${dsParams}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateSuggestions({ results: response, language }))
        .catch(error => Observable.of({
          type: FETCH_SUGGESTIONS_FAILED,
          error: error,
        }));
    });
};

const rootEpic = combineEpics(getSuggestionsEpic);

export default rootEpic;
