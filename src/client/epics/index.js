import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, map, withLatestFrom, catchError } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import { stringify } from 'query-string';
import { has } from 'lodash';
import {
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_RESULTS,
  FETCH_RESULTS_FAILED,
  FETCH_BY_URI,
  FETCH_BY_URI_FAILED,
  FETCH_FACET,
  FETCH_FACET_FAILED,
  updatePaginatedResults,
  updateResults,
  updateInstance,
  updateFacetValues,
} from '../actions';

const apiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/api/'
  : `http://${location.hostname}/api/`;

const backendErrorText = `Cannot connect to the MMM Knowledge Base.
A data conversion process might be running. Please try again later.`;

const fetchPaginatedResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PAGINATED_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, sortBy, variant } = action;
    const { page, pagesize, sortDirection } = state[resultClass];
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: null,
      page: page,
      pagesize: pagesize,
      sortBy: sortBy,
      sortDirection: sortDirection,
      variant: variant
    });
    const requestUrl = `${apiUrl}${resultClass}/paginated?${params}`;
    // https://rxjs-dev.firebaseapp.com/api/ajax/ajax
    return ajax.getJSON(requestUrl).pipe(
      map(response => updatePaginatedResults({ resultClass: resultClass, data: response })),
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
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: facetClass,
      page: null,
      pagesize: null,
      sortBy: null,
      sortDirection: null,
      variant: variant
    });
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
    const { resultClass, facetClass, variant, uri } = action;
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: facetClass,
      page: null,
      pagesize: null,
      sortBy: null,
      sortDirection: null,
      variant: variant
    });
    const requestUrl = `${apiUrl}${resultClass}/instance/${encodeURIComponent(uri)}?${params}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateInstance({ resultClass: resultClass, instance: response })),
      catchError(error => of({
        type: FETCH_BY_URI_FAILED,
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

const fetchFacetEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_FACET),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { facetClass, facetID } = action;
    const facets = state[`${facetClass}Facets`].facets;
    const facet = facets[facetID];
    const { sortBy, sortDirection } = facet;
    const params = stateToUrl({
      facets: facets,
      facetClass: null,
      page: null,
      pagesize: null,
      sortBy: sortBy,
      sortDirection: sortDirection,
      variant: null
    });
    const requestUrl = `${apiUrl}${action.facetClass}/facet/${facetID}?${params}`;
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateFacetValues({
        facetClass: facetClass,
        id: facetID,
        distinctValueCount: res.distinctValueCount,
        values: res.values,
        flatValues: res.flatValues
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

export const stateToUrl = ({
  facets,
  facetClass,
  page,
  pagesize,
  sortBy,
  sortDirection,
  variant
}) => {
  let params = {};
  if (facetClass !== null) { params.facetClass = facetClass; }
  if (page !== null) { params.page = page; }
  if (pagesize !== null) { params.pagesize = pagesize; }
  if (sortBy !== null) { params.sortBy = sortBy; }
  if (sortDirection !== null) { params.sortDirection = sortDirection; }
  if (variant !== null) { params.variant = variant; }
  let uriFilters = {};
  let spatialFilters = {};
  let activeUriFilters = false;
  let activeSpatialFilters = false;
  for (const [key, value] of Object.entries(facets)) {
    if (value.uriFilter.size != 0) {
      activeUriFilters = true;
      uriFilters[key] = Array.from(value.uriFilter);
    } else if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
      activeSpatialFilters = true;
      spatialFilters[key] = boundsToValues(value.spatialFilter._bounds);
    }
  }
  if (activeUriFilters) {
    params.uriFilters = JSON.stringify(uriFilters);
  }
  if (activeSpatialFilters) {
    params.spatialFilters = JSON.stringify(spatialFilters);
  }

  return stringify(params);
};

const boundsToValues = bounds => {
  const latMin = bounds._southWest.lat;
  const longMin = bounds._southWest.lng;
  const latMax = bounds._northEast.lat;
  const longMax = bounds._northEast.lng;
  return {
    latMin: latMin,
    longMin: longMin,
    latMax: latMax,
    longMax: longMax,
  };
};

const rootEpic = combineEpics(
  fetchPaginatedResultsEpic,
  fetchResultsEpic,
  fetchByURIEpic,
  fetchFacetEpic,
);

export default rootEpic;
