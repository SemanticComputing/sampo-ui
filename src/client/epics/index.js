import { of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import axios from 'axios'
import {
  mergeMap,
  switchMap,
  map,
  withLatestFrom,
  debounceTime,
  catchError
} from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable'
import intl from 'react-intl-universal'
import localeEN from '../translations/sampo/localeEN'
import localeFI from '../translations/sampo/localeFI'
import localeSV from '../translations/sampo/localeSV'
import { stateToUrl, handleAxiosError } from '../helpers/helpers'
import querystring from 'querystring'
import {
  FETCH_RESULT_COUNT,
  FETCH_RESULT_COUNT_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_RESULTS,
  FETCH_RESULTS_CLIENT_SIDE,
  FETCH_RESULTS_FAILED,
  FETCH_BY_URI,
  FETCH_BY_URI_FAILED,
  FETCH_FACET,
  FETCH_FACET_CONSTRAIN_SELF,
  FETCH_SIMILAR_DOCUMENTS_BY_ID,
  FETCH_SIMILAR_DOCUMENTS_BY_ID_FAILED,
  FETCH_FACET_FAILED,
  FETCH_GEOJSON_LAYERS,
  LOAD_LOCALES,
  updateResultCount,
  updatePaginatedResults,
  updateResults,
  updateInstance,
  updateInstanceRelatedData,
  updateFacetValues,
  updateFacetValuesConstrainSelf,
  updateLocale,
  updateGeoJSONLayers
} from '../actions'
import {
  rootUrl,
  publishedPort,
  documentFinderAPIUrl,
  backendErrorText
} from '../configs/sampo/GeneralConfig'

// set port if running on localhost with NODE_ENV = 'production'
const port = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? `:${publishedPort}`
  : ''

export const apiUrl = (process.env.NODE_ENV === 'development')
  ? `http://localhost:3001${rootUrl}/api/`
  : `${window.location.protocol}//${window.location.hostname}${port}${rootUrl}/api/`

export const availableLocales = {
  en: localeEN,
  fi: localeFI,
  sv: localeSV
}

const fetchPaginatedResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PAGINATED_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, sortBy } = action
    const { page, pagesize, sortDirection } = state[resultClass]
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: null,
      page: page,
      pagesize: pagesize,
      sortBy: sortBy,
      sortDirection: sortDirection
    })
    const requestUrl = `${apiUrl}${resultClass}/paginated?${params}`
    // https://rxjs-dev.firebaseapp.com/api/ajax/ajax
    return ajax.getJSON(requestUrl).pipe(
      map(response => updatePaginatedResults({
        resultClass: response.resultClass,
        page: response.page,
        pagesize: response.pagesize,
        data: response.data,
        sparqlQuery: response.sparqlQuery
      })),
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
    )
  })
)

const fetchResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass } = action
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: facetClass
    })
    const requestUrl = `${apiUrl}${resultClass}/all?${params}`
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({
        resultClass: resultClass,
        data: response.data,
        sparqlQuery: response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass: resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchResultCountEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_RESULT_COUNT),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass } = action
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: facetClass
    })
    const requestUrl = `${apiUrl}${resultClass}/count?${params}`
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResultCount({
        resultClass: response.resultClass,
        data: response.data,
        sparqlQuery: response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_RESULT_COUNT_FAILED,
        resultClass: resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchResultsClientSideEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_RESULTS_CLIENT_SIDE),
  withLatestFrom(state$),
  debounceTime(500),
  switchMap(([action, state]) => {
    const searchUrl = apiUrl + 'search'
    let requestUrl = ''
    if (action.jenaIndex === 'text') {
      requestUrl = `${searchUrl}?q=${action.query}`
    } else if (action.jenaIndex === 'spatial') {
      const { latMin, longMin, latMax, longMax } = state.map
      requestUrl = `${searchUrl}?latMin=${latMin}&longMin=${longMin}&latMax=${latMax}&longMax=${longMax}`
    }
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({
        resultClass: 'all',
        data: response.data,
        sparqlQuery: response.sparqlQuery,
        query: action.query,
        jenaIndex: action.jenaIndex
      })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass: 'all',
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchByURIEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_BY_URI),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, uri } = action
    const params = stateToUrl({
      facets: facetClass == null ? null : state[`${facetClass}Facets`].facets,
      facetClass: facetClass
    })
    const requestUrl = `${apiUrl}${resultClass}/instance/${encodeURIComponent(uri)}?${params}`
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateInstance({
        resultClass: resultClass,
        data: response.data,
        sparqlQuery: response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_BY_URI_FAILED,
        resultClass: resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchFacetEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_FACET),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { facetClass, facetID } = action
    const facets = state[`${facetClass}Facets`].facets
    const facet = facets[facetID]
    const { sortBy, sortDirection } = facet
    const params = stateToUrl({
      facets: facets,
      sortBy: sortBy,
      sortDirection: sortDirection
    })
    const requestUrl = `${apiUrl}${action.facetClass}/facet/${facetID}?${params}`
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateFacetValues({
        facetClass: facetClass,
        id: facetID,
        data: res.data || [],
        flatData: res.flatData || [],
        sparqlQuery: res.sparqlQuery
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
    )
  })
)

const fetchFacetConstrainSelfEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_FACET_CONSTRAIN_SELF),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { facetClass, facetID } = action
    const facets = state[`${facetClass}Facets`].facets
    const facet = facets[facetID]
    const { sortBy, sortDirection } = facet
    const params = stateToUrl({
      facets: facets,
      sortBy: sortBy,
      sortDirection: sortDirection,
      constrainSelf: true
    })
    const requestUrl = `${apiUrl}${action.facetClass}/facet/${facetID}?${params}`
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateFacetValuesConstrainSelf({
        facetClass: facetClass,
        id: facetID,
        data: res.data || [],
        flatData: res.flatData || [],
        sparqlQuery: res.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_FACET_FAILED,
        resultClass: action.facetClass,
        id: action.id,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const loadLocalesEpic = action$ => action$.pipe(
  ofType(LOAD_LOCALES),
  // https://thecodebarbarian.com/a-beginners-guide-to-redux-observable
  mergeMap(async action => {
    await intl.init({
      currentLocale: action.currentLanguage,
      locales: availableLocales
    })
    return updateLocale({ language: action.currentLanguage })
  })
)

const fetchSimilarDocumentsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_SIMILAR_DOCUMENTS_BY_ID),
  withLatestFrom(state$),
  mergeMap(([action]) => {
    const { resultClass, id, modelName, resultSize } = action
    const requestUrl = `${documentFinderAPIUrl}/top-similar/${modelName}/${id}?n=${resultSize}`
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateInstanceRelatedData({
        resultClass,
        data: res.documents || null
      })),
      catchError(error => of({
        type: FETCH_SIMILAR_DOCUMENTS_BY_ID_FAILED,
        resultClass: action.resultClass,
        id: action.id,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchGeoJSONLayers = action$ => action$.pipe(
  ofType(FETCH_GEOJSON_LAYERS),
  mergeMap(async action => {
    const { layerIDs, bounds } = action
    const data = await Promise.all(layerIDs.map(layerID => fetchGeoJSONLayer(layerID, bounds)))
    return updateGeoJSONLayers({ payload: data })
  })
)

const fetchGeoJSONLayer = async (layerID, bounds) => {
  const baseUrl = 'http://kartta.nba.fi/arcgis/services/WFS/MV_Kulttuuriymparisto/MapServer/WFSServer'
  const boundsStr =
    `${bounds._southWest.lng},${bounds._southWest.lat},${bounds._northEast.lng},${bounds._northEast.lat}`
  const mapServerParams = {
    request: 'GetFeature',
    service: 'WFS',
    version: '2.0.0',
    typeName: layerID,
    srsName: 'EPSG:4326',
    outputFormat: 'geojson',
    bbox: boundsStr
  }
  const url = `${baseUrl}?${querystring.stringify(mapServerParams)}`
  try {
    const response = await axios.get(url)
    return {
      layerID: layerID,
      geoJSON: response.data
    }
  } catch (error) {
    handleAxiosError(error)
  }
}

const rootEpic = combineEpics(
  fetchPaginatedResultsEpic,
  fetchResultsEpic,
  fetchResultCountEpic,
  fetchResultsClientSideEpic,
  fetchByURIEpic,
  fetchFacetEpic,
  fetchFacetConstrainSelfEpic,
  loadLocalesEpic,
  fetchSimilarDocumentsEpic,
  fetchGeoJSONLayers
)

export default rootEpic
