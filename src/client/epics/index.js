import 'rxjs';
import _ from 'lodash';
import { ajax } from 'rxjs/observable/dom/ajax';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import {
  updateManuscripts,
  updatePlaces,
  updateFacet,
  updateGeoJSON,
  FETCH_FACET,
  FETCH_FACET_FAILED,
  FETCH_MANUSCRIPTS,
  FETCH_MANUSCRIPTS_FAILED,
  FETCH_PLACES,
  FETCH_PLACES_FAILED,
  GET_GEOJSON,
  GET_GEOJSON_FAILED
} from '../actions';

const hiplaApiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/'
  : 'http://193.166.25.181:3006/';

const pickSelectedDatasets = (datasets) => {
  let selected = [];
  Object.keys(datasets).map(key => {
    if (datasets[key].selected) {
      selected.push(key);
    }
  });
  return selected;
};

const getManuscripts = (action$) => {
  const searchUrl = hiplaApiUrl + 'manuscripts';
  return action$.ofType(FETCH_MANUSCRIPTS)
    .switchMap(action => {
      const requestUrl = `${searchUrl}?page=${action.page}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateManuscripts({ manuscripts: response }))
        .catch(error => Observable.of({
          type: FETCH_MANUSCRIPTS_FAILED,
          error: error,
        }));
    });
};

const getPlaces = (action$, store) => {
  const searchUrl = hiplaApiUrl + 'places';
  return action$.ofType(FETCH_PLACES)
    .switchMap(() => {
      const { datasets } = store.getState().search;
      const dsParams = _.map(pickSelectedDatasets(datasets), ds => `dataset=${ds}`).join('&');
      const requestUrl = `${searchUrl}?${dsParams}`;
      return ajax.getJSON(requestUrl)
        .map(response => updatePlaces({ places: response }))
        .catch(error => Observable.of({
          type: FETCH_PLACES_FAILED,
          error: error,
        }));
    });
};

const getFacet = (action$) => {
  const searchUrl = hiplaApiUrl + 'facet';
  return action$.ofType(FETCH_FACET)
    .switchMap((action) => {
      const requestUrl = `${searchUrl}?property=${action.property}`;
      return ajax.getJSON(requestUrl)
        .map(response => updateFacet({ values: response }))
        .catch(error => Observable.of({
          type: FETCH_FACET_FAILED,
          error: error,
        }));
    });
};

const getGeoJSONEpic = (action$) => {
  const wfsUrl = hiplaApiUrl + 'wfs';
  return action$.ofType(GET_GEOJSON)
    .switchMap(action => {
      let s = '';
      action.layerIDs.map(layerID => {
        s += `&layerID=${layerID}`;
      });
      const requestUrl = `${wfsUrl}?${s}`;
      return ajax.getJSON(requestUrl)
        // .map(response => {
        //   console.log(response)
        // })
        .map(response => updateGeoJSON({ geoJSON: response }))
        .catch(error => Observable.of({
          type: GET_GEOJSON_FAILED,
          error: error,
        }));
    });
};


const rootEpic = combineEpics(
  getManuscripts,
  getPlaces,
  getFacet,
  getGeoJSONEpic
);

export default rootEpic;
