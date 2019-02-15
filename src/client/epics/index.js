import { ajax } from 'rxjs/ajax';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import { stringify } from 'query-string';
import {
  FETCH_RESULTS,
  FETCH_BY_URI,
  FETCH_FACET,
  updateResults,
  updateInstance,
  updateFacet,

} from '../actions';

const apiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/api/'
  : `http://${location.hostname}/api/`;

const fetchResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass } = action;
    const resultState = resultStateToUrl(state[resultClass], state[`${resultClass}Facets`]);
    const requestUrl = `${apiUrl + resultClass}?${resultState}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({ data: response }))
    );
  })
);

// const getPlaces = action$ => action$.pipe(
//   ofType(FETCH_PLACES),
//   mergeMap(action => {
//     const searchUrl = apiUrl + 'places';
//     const requestUrl = `${searchUrl}?variant=${action.variant}`;
//     return ajax.getJSON(requestUrl).pipe(
//       map(response => updatePlaces({ places: response }))
//     );
//   })
// );

const fetchByURIEpic = action$ => action$.pipe(
  ofType(FETCH_BY_URI),
  mergeMap(action => {
    const searchUrl = apiUrl + 'places';
    const requestUrl = `${searchUrl}/${encodeURIComponent(action.placeId)}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateInstance({ instance: response }))
    );
  })
);

const fetchFacetEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_FACET),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    let params = {
      sortBy: action.sortBy,
      sortDirection: action.sortDirection
    };
    let filters = {};
    let activeFilters = false;
    for (const [key, value] of Object.entries(state[`${action.resultClass}Facets`].filters)) {
      if (value.size != 0) {
        activeFilters = true;
        filters[key] = Array.from(value);
      }
    }
    if (activeFilters) {
      params.filters = JSON.stringify(filters);
    }
    const requestUrl = `${apiUrl}facet/${action.id}?${stringify(params)}`;
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateFacet({
        id: action.id,
        distinctValueCount: res.distinctValueCount,
        values: res.values,
        flatValues: res.flatValues,
        sortBy: action.sortBy,
        sortDirection: action.sortDirection
      }))
    );
  })
);

export const resultStateToUrl = (data, facets) => {
  let params = {
    page: data.page,
    pagesize: data.pagesize,
    sortBy: data.sortBy,
    sortDirection: data.sortDirection
  };
  let filters = {};
  let activeFilters = false;
  for (const [key, value] of Object.entries(facets.filters)) {
    if (value.size != 0) {
      activeFilters = true;
      filters[key] = Array.from(value);
    }
  }
  if (activeFilters) {
    params.filters = JSON.stringify(filters);
  }
  return stringify(params);
};

const rootEpic = combineEpics(
  fetchResultsEpic,
  fetchByURIEpic,
  fetchFacetEpic,
);

export default rootEpic;
