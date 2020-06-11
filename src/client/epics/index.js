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
import { stateToUrl, handleAxiosError, pickSelectedDatasets /* boundsToValues */ } from '../helpers/helpers'
import querystring from 'querystring'
import {
  FETCH_RESULT_COUNT,
  FETCH_RESULT_COUNT_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_RESULTS,
  FETCH_FULL_TEXT_RESULTS,
  FETCH_RESULTS_FAILED,
  FETCH_BY_URI,
  FETCH_BY_URI_FAILED,
  FETCH_FACET,
  FETCH_FACET_CONSTRAIN_SELF,
  FETCH_SIMILAR_DOCUMENTS_BY_ID,
  FETCH_SIMILAR_DOCUMENTS_BY_ID_FAILED,
  FETCH_FACET_FAILED,
  FETCH_GEOJSON_LAYERS,
  FETCH_NETWORK_BY_ID,
  FETCH_NETWORK_BY_ID_FAILED,
  FETCH_GEOJSON_LAYERS_BACKEND,
  CLIENT_FS_FETCH_RESULTS,
  CLIENT_FS_FETCH_RESULTS_FAILED,
  LOAD_LOCALES,
  updateResultCount,
  updatePaginatedResults,
  updateResults,
  clientFSUpdateResults,
  updateInstance,
  updateInstanceRelatedData,
  updateInstanceNetworkData,
  updateFacetValues,
  updateFacetValuesConstrainSelf,
  updateLocale,
  updateGeoJSONLayers,
  SHOW_ERROR
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
  ? `http://localhost:3001${rootUrl}/api/v1`
  : `${window.location.protocol}//${window.location.hostname}${port}${rootUrl}/api/v1`

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
    const requestUrl = `${apiUrl}/faceted-search/${resultClass}/paginated`
    // https://rxjs-dev.firebaseapp.com/api/ajax/ajax
    return ajax({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params
    }).pipe(
      map(ajaxResponse =>
        updatePaginatedResults({
          resultClass: ajaxResponse.response.resultClass,
          page: ajaxResponse.response.page,
          pagesize: ajaxResponse.response.pagesize,
          data: ajaxResponse.response.data,
          sparqlQuery: ajaxResponse.response.sparqlQuery
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
    const { resultClass, facetClass, limit, optimize } = action
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass,
      limit,
      optimize
    })
    const requestUrl = `${apiUrl}/faceted-search/${resultClass}/all`
    // https://rxjs-dev.firebaseapp.com/api/ajax/ajax
    return ajax({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params
    }).pipe(
      map(ajaxResponse => updateResults({
        resultClass: resultClass,
        data: ajaxResponse.response.data,
        sparqlQuery: ajaxResponse.response.sparqlQuery
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
      facets: state[`${facetClass}Facets`].facets
    })
    const requestUrl = `${apiUrl}/faceted-search/${resultClass}/count`
    return ajax({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params
    }).pipe(
      map(ajaxResponse => updateResultCount({
        resultClass: ajaxResponse.response.resultClass,
        data: ajaxResponse.response.data,
        sparqlQuery: ajaxResponse.response.sparqlQuery
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

const fullTextSearchEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_FULL_TEXT_RESULTS),
  withLatestFrom(state$),
  debounceTime(500),
  switchMap(([action, state]) => {
    const requestUrl = `${apiUrl}/full-text-search?q=${action.query}`
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateResults({
        resultClass: 'fullText',
        data: response.data,
        sparqlQuery: response.sparqlQuery,
        query: action.query,
        jenaIndex: action.jenaIndex
      })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass: 'fullText',
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
      facetClass
    })
    const requestUrl = `${apiUrl}/${resultClass}/page/${encodeURIComponent(uri)}`
    return ajax({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params
    }).pipe(
      map(ajaxResponse => updateInstance({
        resultClass: resultClass,
        data: ajaxResponse.response.data,
        sparqlQuery: ajaxResponse.response.sparqlQuery
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
    const requestUrl = `${apiUrl}/faceted-search/${action.facetClass}/facet/${facetID}`
    return ajax({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params
    }).pipe(
      map(ajaxResponse => updateFacetValues({
        facetClass: facetClass,
        id: ajaxResponse.response.id,
        data: ajaxResponse.response.data || [],
        flatData: ajaxResponse.response.flatData || [],
        sparqlQuery: ajaxResponse.response.sparqlQuery
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
    const requestUrl = `${apiUrl}/faceted-search/${action.facetClass}/facet/${facetID}`
    return ajax({
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params
    }).pipe(
      map(ajaxResponse => updateFacetValuesConstrainSelf({
        facetClass: facetClass,
        id: facetID,
        data: ajaxResponse.response.data || [],
        flatData: ajaxResponse.response.flatData || [],
        sparqlQuery: ajaxResponse.response.sparqlQuery
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

const clientFSFetchResultsEpic = (action$, state$) => action$.pipe(
  ofType(CLIENT_FS_FETCH_RESULTS),
  withLatestFrom(state$),
  debounceTime(500),
  switchMap(([action, state]) => {
    const { jenaIndex } = action
    const selectedDatasets = pickSelectedDatasets(state.clientSideFacetedSearch.datasets)
    const dsParams = selectedDatasets.map(ds => `dataset=${ds}`).join('&')
    let requestUrl
    if (action.jenaIndex === 'text') {
      requestUrl = `${apiUrl}/federated-search?q=${action.query}&${dsParams}`
    } else if (action.jenaIndex === 'spatial') {
      const { latMin, longMin, latMax, longMax } = state.leafletMap
      requestUrl = `${apiUrl}/federated-search?latMin=${latMin}&longMin=${longMin}&latMax=${latMax}&longMax=${longMax}&${dsParams}`
    }
    return ajax.getJSON(requestUrl).pipe(
      map(response => clientFSUpdateResults({
        results: response,
        jenaIndex
      })),
      catchError(error => of({
        type: CLIENT_FS_FETCH_RESULTS_FAILED,
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

const fetchNetworkByURIEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_NETWORK_BY_ID),
  withLatestFrom(state$),
  mergeMap(([action]) => {
    const { resultClass, id, limit, optimize } = action
    const params = { limit, optimize }
    const requestUrl = `${apiUrl}/${resultClass}/network/${encodeURIComponent(id)}?${querystring.stringify(params)}`
    return ajax.getJSON(requestUrl).pipe(
      map(response => updateInstanceNetworkData({
        resultClass: resultClass,
        data: response.data,
        sparqlQuery: response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_NETWORK_BY_ID_FAILED,
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

const fetchGeoJSONLayersBackendEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_GEOJSON_LAYERS_BACKEND),
  withLatestFrom(state$),
  mergeMap(([action]) => {
    const { layerIDs /* bounds */ } = action
    // const { latMin, longMin, latMax, longMax } = boundsToValues(bounds)
    const params = {
      layerID: layerIDs
      // latMin,
      // longMin,
      // latMax,
      // longMax
    }
    const requestUrl = `${apiUrl}/wfs?${querystring.stringify(params)}`
    return ajax.getJSON(requestUrl).pipe(
      map(res => updateGeoJSONLayers({
        payload: res
      })),
      catchError(error => of({
        type: SHOW_ERROR,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchGeoJSONLayersEpic = action$ => action$.pipe(
  ofType(FETCH_GEOJSON_LAYERS),
  mergeMap(async action => {
    const { layerIDs, bounds } = action
    const data = await Promise.all(layerIDs.map(layerID => fetchGeoJSONLayer(layerID, bounds)))
    return updateGeoJSONLayers({ payload: data })
  })
)

const fetchGeoJSONLayer = async (layerID, bounds) => {
  const baseUrl = 'https://kartta.nba.fi/arcgis/services/WFS/MV_Kulttuuriymparisto/MapServer/WFSServer'
  // const baseUrl = 'http://avaa.tdata.fi/geoserver/kotus/ows'
  // const baseUrl = 'http://avaa.tdata.fi/geoserver/paituli/wfs'
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
    // outputFormat: 'application/json' for kotus layers
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
  fetchByURIEpic,
  fetchFacetEpic,
  fetchFacetConstrainSelfEpic,
  fetchNetworkByURIEpic,
  fullTextSearchEpic,
  clientFSFetchResultsEpic,
  loadLocalesEpic,
  fetchSimilarDocumentsEpic,
  fetchGeoJSONLayersEpic,
  fetchGeoJSONLayersBackendEpic
)

export default rootEpic
