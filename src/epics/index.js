import 'rxjs';
import _ from 'lodash';
import { ajax } from 'rxjs/observable/dom/ajax';
import { combineEpics } from 'redux-observable';
import { updateResults, FETCH_RESULTS } from '../actions';

const getSuggestionsEpic = (action$, store) => {
  const searchUrl = 'http://localhost:3000/search';

  return action$.ofType(FETCH_RESULTS)
    .debounceTime(500)
    .switchMap(() => {
      const { query, datasets } = store.getState().search;
      const dsParams = _.map(datasets, ds => `dataset=${ds}`).join('&');

      const requestUrl = `${searchUrl}?q=${query}&${dsParams}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateResults(response));
    });
};

const rootEpic = combineEpics(getSuggestionsEpic);

export default rootEpic;
