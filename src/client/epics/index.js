
import { ajax } from 'rxjs/ajax';
import { mergeMap, map } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import {
  updateManuscripts,
  updatePlaces,
  updateFacet,
  updateResults,
  //updateGeoJSON,
  FETCH_FACET,
  //FETCH_FACET_FAILED,
  FETCH_MANUSCRIPTS,
  //FETCH_MANUSCRIPTS_FAILED,
  FETCH_PLACES,
  FETCH_RESULTS
  //FETCH_PLACES_FAILED,
  //GET_GEOJSON,
  //GET_GEOJSON_FAILED
} from '../actions';

const hiplaApiUrl = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:3001/'
  : 'http://193.166.25.181:3006/';

const getManuscripts = action$ => action$.pipe(
  ofType(FETCH_MANUSCRIPTS),
  mergeMap(action => {
    const searchUrl = hiplaApiUrl + 'manuscripts';
    const requestUrl = `${searchUrl}?page=${action.page}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateManuscripts({ manuscripts: response, page: action.page }))
    );
  })
);

const getPlaces = action$ => action$.pipe(
  ofType(FETCH_PLACES),
  mergeMap(() => {
    const searchUrl = hiplaApiUrl + 'places';
    const requestUrl = `${searchUrl}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updatePlaces({ places: response }))
    );
  })
);

const getFacet = action$ => action$.pipe(
  ofType(FETCH_FACET),
  mergeMap((action) => {
    const searchUrl = hiplaApiUrl + 'facet';
    const requestUrl = `${searchUrl}?property=${action.property}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateFacet({ facetValues: response }))
    );
  })
);

const getResultCount = action$ => action$.pipe(
  ofType(FETCH_RESULTS),
  mergeMap(() => {
    const searchUrl = hiplaApiUrl + 'manuscript-count';
    const requestUrl = `${searchUrl}`;
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({ results: response }))
    );
  })
);

// const getGeoJSONEpic = (action$) => {
//   const wfsUrl = hiplaApiUrl + 'wfs';
//   return action$.ofType(GET_GEOJSON)
//     .switchMap(action => {
//       let s = '';
//       action.layerIDs.map(layerID => {
//         s += `&layerID=${layerID}`;
//       });
//       const requestUrl = `${wfsUrl}?${s}`;
//       return ajax.getJSON(requestUrl)
//         // .map(response => {
//         //   console.log(response)
//         // })
//         .map(response => updateGeoJSON({ geoJSON: response }))
//         .catch(error => Observable.of({
//           type: GET_GEOJSON_FAILED,
//           error: error,
//         }));
//     });
// };


const rootEpic = combineEpics(
  getManuscripts,
  getPlaces,
  getFacet,
  getResultCount,
  // getGeoJSONEpic
);

export default rootEpic;
