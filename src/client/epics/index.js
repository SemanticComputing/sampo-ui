import { ajax } from 'rxjs/ajax';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import { stringify } from 'query-string';
import {
  updateManuscripts,
  updatePlaces,
  updatePlace,
  updateFacet,
  FETCH_FACET,
  FETCH_MANUSCRIPTS,
  FETCH_PLACES,
  FETCH_PLACE,
} from '../actions';

const apiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/api/'
  : `${location.href}api/`;

const getManuscripts = (action$, state$) => action$.pipe(
  ofType(FETCH_MANUSCRIPTS),
  withLatestFrom(state$),
  mergeMap(([, state]) => {
    const searchUrl = apiUrl + 'manuscripts';
    const requestUrl = `${searchUrl}?${facetStateToUrl(state.search.page, state.facet.facetFilters)}`;
    return ajax.getJSON(requestUrl).pipe(
      map(data => updateManuscripts({ data }))
    );
  })
);

const getPlaces = action$ => action$.pipe(
  ofType(FETCH_PLACES),
  mergeMap(action => {
    const searchUrl = apiUrl + 'places';
    const requestUrl = `${searchUrl}?variant=${action.variant}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updatePlaces({ places: response }))
    );
  })
);

const getPlace = action$ => action$.pipe(
  ofType(FETCH_PLACE),
  mergeMap(action => {
    const searchUrl = apiUrl + 'places';
    const requestUrl = `${searchUrl}/${encodeURIComponent(action.placeId)}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updatePlace({ place: response }))
    );
  })
);

const getFacet = (action$, state$) => action$.pipe(
  ofType(FETCH_FACET),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    let requestUrl = '';
    let params = {};
    let filters = {};
    let activeFilters = false;
    for (const [key, value] of Object.entries(state.facet.facetFilters)) {
      if (value.size != 0) {
        activeFilters = true;
        filters[key] = Array.from(value);
      }
    }
    if (activeFilters) {
      params.filters = JSON.stringify(filters);
      requestUrl = `${apiUrl}facet/${action.id}?${stringify(params)}`;
    } else {
      requestUrl = `${apiUrl}facet/${action.id}`;
    }
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateFacet({
        id: action.id,
        facetValues: response,
      }))
    );
  })
);

export const facetStateToUrl = (page, facetFilters) => {
  let params = { page: page };
  let filters = {};
  let activeFilters = false;
  for (const [key, value] of Object.entries(facetFilters)) {
    if (value.size != 0) {
      activeFilters = true;
      filters[key] = Array.from(value);
    }
  }
  if (activeFilters) {
    params.filters = JSON.stringify(filters);
  }
  // console.log(params)
  return stringify(params);

};

const rootEpic = combineEpics(
  getManuscripts,
  getPlaces,
  getPlace,
  getFacet,
);

export default rootEpic;
