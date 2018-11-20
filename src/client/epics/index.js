
import { ajax } from 'rxjs/ajax';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import {
  updateManuscripts,
  updatePlaces,
  updatePlace,
  updateFacet,
  updateResults,
  FETCH_FACET,
  //FETCH_FACET_FAILED,
  FETCH_MANUSCRIPTS,
  //FETCH_MANUSCRIPTS_FAILED,
  FETCH_PLACES,
  FETCH_PLACE,
  FETCH_RESULTS
  //FETCH_PLACES_FAILED,
} from '../actions';

const apiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/'
  : 'http://test.ui.mappingmanuscriptmigrations.org/';

const getManuscripts = (action$, state$) => action$.pipe(
  ofType(FETCH_MANUSCRIPTS),
  withLatestFrom(state$),
  mergeMap(([, state]) => {
    const searchUrl = apiUrl + 'manuscripts';
    console.log(state.search.page)
    const requestUrl = `${searchUrl}?page=${state.search.page}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateManuscripts({ manuscripts: response }))
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
    const requestUrl = `${searchUrl}/${action.placeId}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updatePlace({ place: response }))
    );
  })
);

const getFacet = (action$, state$) => action$.pipe(
  ofType(FETCH_FACET),
  withLatestFrom(state$),
  mergeMap(([, state]) => {
    const requestUrl = `${apiUrl}facet`;
    //console.log(state.facet)
    //const facetFilters = state$.getState().facet.facetFilters;
    //let str = Object.entries(facetFilters).map(([key, set]) => `${key}=${Array.from(set)}`).join('&');
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateFacet({ facetValues: response }))
    );
  })
);

const getResultCount = action$ => action$.pipe(
  ofType(FETCH_RESULTS),
  mergeMap(() => {
    const searchUrl = apiUrl + 'manuscript-count';
    const requestUrl = `${searchUrl}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({ results: response }))
    );
  })
);

const rootEpic = combineEpics(
  getManuscripts,
  getPlaces,
  getPlace,
  getFacet,
  getResultCount,
);

export default rootEpic;
