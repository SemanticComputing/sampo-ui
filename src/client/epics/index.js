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
    const { resultClass, facetClass, variant } = action;
    const params = stateSliceToUrl(state[resultClass], state[`${facetClass}Facets`], variant);
    const requestUrl = `${apiUrl}${resultClass}/results?${params}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({ resultClass: resultClass, data: response }))
    );
  })
);

const fetchByURIEpic = action$ => action$.pipe(
  ofType(FETCH_BY_URI),
  mergeMap(action => {
    const { uri, resultClass } = action;
    const requestUrl = `${apiUrl}${resultClass}/instance/${encodeURIComponent(uri)}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateInstance({ resultClass: resultClass, instance: response }))
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

export const stateSliceToUrl = (stateSlice, facets, variant) => {
  let params = {
    page: stateSlice.page,
    pagesize: stateSlice.pagesize,
    sortBy: stateSlice.sortBy,
    sortDirection: stateSlice.sortDirection,
  };
  if (variant !== null) {
    params.variant = variant;
  }
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
