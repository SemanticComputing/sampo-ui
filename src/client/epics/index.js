import 'rxjs';
import _ from 'lodash';
import { ajax } from 'rxjs/observable/dom/ajax';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import {
  updateSuggestions,
  updateResults,
  updateGeoJSON,
  FETCH_SUGGESTIONS,
  FETCH_SUGGESTIONS_FAILED,
  FETCH_RESULTS,
  FETCH_RESULTS_FAILED,
  GET_GEOJSON,
  GET_GEOJSON_FAILED
} from '../actions';

const hiplaApiUrl = 'http://localhost:3000/api/';

const getSuggestionsEpic = (action$, store) => {
  const searchUrl = hiplaApiUrl + 'suggest';
  return action$.ofType(FETCH_SUGGESTIONS)
    .debounceTime(1000)
    .switchMap(() => {
      const { query, datasets } = store.getState().search;
      if (query.length < 3) {
        return [];
      }
      const dsParams = _.map(datasets, ds => `dataset=${ds}`).join('&');
      const requestUrl = `${searchUrl}?q=${query}&${dsParams}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateSuggestions({ suggestions: response }))
        .catch(error => Observable.of({
          type: FETCH_SUGGESTIONS_FAILED,
          error: error,
        }));
    });
};

const getResultsEpic = (action$, store) => {
  const searchUrl = hiplaApiUrl + 'search';
  return action$.ofType(FETCH_RESULTS)
    .debounceTime(500)
    .switchMap(() => {
      const { query, datasets } = store.getState().search;
      if (query.length < 3) {
        return [];
      }
      const dsParams = _.map(datasets, ds => `dataset=${ds}`).join('&');
      const requestUrl = `${searchUrl}?q=${query}&${dsParams}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateResults({ results: response }))
        .catch(error => Observable.of({
          type: FETCH_RESULTS_FAILED,
          error: error,
        }));
    });
};

const getGeoJSONEpic = (action$) => {
  const searchUrl = hiplaApiUrl + 'wfs';
  return action$.ofType(GET_GEOJSON)
    .switchMap(() => {
      return ajax.getJSON(searchUrl)
        // .map(response => {
        //   console.log('res' + response)
        // })
        .map(response => updateGeoJSON({ geoJSON: response }))
        .catch(error => Observable.of({
          type: GET_GEOJSON_FAILED,
          error: error,
        }));
    });
};


const rootEpic = combineEpics(getSuggestionsEpic, getResultsEpic, getGeoJSONEpic);

export default rootEpic;
