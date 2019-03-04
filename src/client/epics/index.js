import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, map, withLatestFrom, catchError } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import { stringify } from 'query-string';
import {
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_RESULTS,
  FETCH_RESULTS_FAILED,
  FETCH_BY_URI,
  FETCH_FACET,
  FETCH_FACET_FAILED,
  //SHOW_ERROR,
  updateResults,
  updateInstance,
  updateFacet,
} from '../actions';

const apiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/api/'
  : `http://${location.hostname}/api/`;

const backendErrorText = 'Cannot connect to the MMM Knowledge Base. A data conversion process might be running. Please try again later.';

const fetchPaginatedResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PAGINATED_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, variant } = action;
    const params = stateSlicesToUrl(state[resultClass], state[`${facetClass}Facets`], variant, null);
    const requestUrl = `${apiUrl}${resultClass}/paginated?${params}`;
    // https://rxjs-dev.firebaseapp.com/api/ajax/ajax
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({ resultClass: resultClass, data: response })),
      // https://redux-observable.js.org/docs/recipes/ErrorHandling.html
      catchError(error => of({
        type: FETCH_PAGINATED_RESULTS_FAILED,
        resultClass: resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    );
  })
);

const fetchResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, variant } = action;
    const params = stateSlicesToUrl(null, state[`${facetClass}Facets`], variant, facetClass);
    const requestUrl = `${apiUrl}${resultClass}/all?${params}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({ resultClass: resultClass, data: response })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass: resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    );
  })
);

const fetchByURIEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_BY_URI),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, uri } = action;
    const params = stateSlicesToUrl(null, state[`${facetClass}Facets`], null, null);
    const requestUrl = `${apiUrl}${resultClass}/instance/${encodeURIComponent(uri)}?${params}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateInstance({ resultClass: resultClass, instance: response })),
      // catchError(error => of({
      //   type: SHOW_ERROR,
      //   message: {
      //     text: error.xhr.statusText,
      //     title: ''
      //   }
      // }))
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
    const requestUrl = `${apiUrl}${action.resultClass}/facet/${action.id}?${stringify(params)}`;
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateFacet({
        resultClass: action.resultClass,
        id: action.id,
        distinctValueCount: res.distinctValueCount,
        values: res.values,
        flatValues: res.flatValues,
        sortBy: action.sortBy,
        sortDirection: action.sortDirection
      })),
      catchError(error => of({
        type: FETCH_FACET_FAILED,
        resultClass: action.resultClass,
        id: action.id,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    );
  })
);

export const stateSlicesToUrl = (pagination, facets, variant, facetClass) => {
  let params = {};
  if (pagination != null) {
    params.page = pagination.page;
    params.pagesize =  pagination.pagesize;
    params.sortBy = pagination.sortBy;
    params.sortDirection = pagination.sortDirection;
  }
  if (variant !== null) {
    params.variant = variant;
  }
  if (facetClass !== null) {
    params.facetClass = facetClass;
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
  fetchPaginatedResultsEpic,
  fetchResultsEpic,
  fetchByURIEpic,
  fetchFacetEpic,
);

export default rootEpic;
