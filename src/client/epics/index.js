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
import { stateToUrl, pickSelectedDatasets } from '../helpers/helpers'
import querystring from 'querystring'
import {
  FETCH_RESULT_COUNT,
  FETCH_RESULT_COUNT_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_RESULTS,
  FETCH_INSTANCE_ANALYSIS,
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
  FETCH_GEOJSON_LAYERS_BACKEND,
  FETCH_KNOWLEDGE_GRAPH_METADATA,
  FETCH_KNOWLEDGE_GRAPH_METADATA_FAILED,
  CLIENT_FS_FETCH_RESULTS,
  CLIENT_FS_FETCH_RESULTS_FAILED,
  LOAD_LOCALES,
  SHOW_ERROR,
  updateResultCount,
  updatePaginatedResults,
  updateResults,
  clientFSUpdateResults,
  updateInstanceTable,
  updateInstanceTableExternal,
  updateInstanceAnalysisData,
  updateFacetValues,
  updateFacetValuesConstrainSelf,
  updateLocale,
  updateGeoJSONLayers,
  updateKnowledgeGraphMetadata,
  fetchGeoJSONLayersFailed
} from '../actions'
import portalConfig from '../../configs/portalConfig.json'
const { portalID, localeConfig, documentFinderConfig } = portalConfig
const { documentFinderAPIUrl } = documentFinderConfig
export const availableLocales = {}
for (const locale of localeConfig.availableLocales) {
  availableLocales[locale.id] = await import(`../translations/${portalID}/${locale.filename}`)
}

/*
* Note that all code inside the 'client' folder runs on the browser, so there is no 'process' object as in Node.js.
* Instead, the variable 'process.env.API_URL' is defined in 'webpack.client.common.js'.
*/
const apiUrl = process.env.API_URL

let backendErrorText = null

const fetchPaginatedResultsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PAGINATED_RESULTS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, sortBy } = action
    const { page, pagesize, sortDirection } = state[resultClass]
    const params = stateToUrl({
      facets: state[`${facetClass}Facets`].facets,
      facetClass: null,
      page,
      pagesize,
      sortBy,
      sortDirection
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
          resultClass,
          data: ajaxResponse.response.data,
          sparqlQuery: ajaxResponse.response.sparqlQuery
        })),
      // https://redux-observable.js.org/docs/recipes/ErrorHandling.html
      catchError(error => of({
        type: FETCH_PAGINATED_RESULTS_FAILED,
        resultClass,
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
    const { perspectiveID, resultClass, facetClass, limit, optimize } = action
    const params = stateToUrl({
      perspectiveID,
      facets: facetClass ? state[`${facetClass}Facets`].facets : null,
      facetClass,
      uri: action.uri ? action.uri : null,
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
        resultClass,
        data: ajaxResponse.response.data,
        sparqlQuery: ajaxResponse.response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const fetchInstanceAnalysisEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_INSTANCE_ANALYSIS),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { resultClass, facetClass, fromID, toID, period, province } = action
    const params = stateToUrl({
      facets: facetClass ? state[`${facetClass}Facets`].facets : null,
      facetClass,
      uri: action.uri ? action.uri : null,
      fromID,
      toID,
      period,
      province
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
      map(ajaxResponse => updateInstanceAnalysisData({
        resultClass,
        data: ajaxResponse.response.data,
        sparqlQuery: ajaxResponse.response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass,
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
        resultClass,
        data: ajaxResponse.response.data,
        sparqlQuery: ajaxResponse.response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_RESULT_COUNT_FAILED,
        resultClass,
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
        resultClass: 'fullTextSearch',
        data: response.data,
        sparqlQuery: response.sparqlQuery,
        query: action.query,
        jenaIndex: action.jenaIndex
      })),
      catchError(error => of({
        type: FETCH_RESULTS_FAILED,
        resultClass: 'fullTextSearch',
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
    const { perspectiveID, resultClass, facetClass, uri } = action
    const params = stateToUrl({
      perspectiveID,
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
      map(ajaxResponse => updateInstanceTable({
        resultClass,
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
    const { facetClass, facetID, constrainSelf } = action
    const facets = state[`${facetClass}Facets`].facets
    const facet = facets[facetID]
    const { sortBy = null, sortDirection = null } = facet
    const params = stateToUrl({
      facets,
      sortBy,
      sortDirection,
      constrainSelf
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
        facetClass,
        id: ajaxResponse.response.id,
        data: ajaxResponse.response.data || [],
        flatData: ajaxResponse.response.flatData || [],
        sparqlQuery: ajaxResponse.response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_FACET_FAILED,
        facetClass,
        facetID,
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
        facetClass,
        id: facetID,
        data: ajaxResponse.response.data || [],
        flatData: ajaxResponse.response.flatData || [],
        sparqlQuery: ajaxResponse.response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_FACET_FAILED,
        resultClass: facetClass,
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
    const { perspectiveID, jenaIndex } = action
    const federatedSearchState = state[perspectiveID]
    const selectedDatasets = pickSelectedDatasets(federatedSearchState.datasets)
    const dsParams = selectedDatasets.map(ds => `dataset=${ds}`).join('&')
    let requestUrl
    if (action.jenaIndex === 'text') {
      requestUrl = `${apiUrl}/federated-search?q=${action.query}&${dsParams}&perspectiveID=${perspectiveID}`
    } else if (action.jenaIndex === 'spatial') {
      const { latMin, longMin, latMax, longMax } = federatedSearchState.maps.boundingboxSearch
      requestUrl = `${apiUrl}/federated-search?latMin=${latMin}&longMin=${longMin}&latMax=${latMax}&longMax=${longMax}&${dsParams}&perspectiveID=${perspectiveID}`
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
      locales: availableLocales,
      warningHandler: () => null
    })
    backendErrorText = intl.get('backendErrorText')
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
      map(res => updateInstanceTableExternal({
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
    try {
      const data = await Promise.all(layerIDs.map(layerID => fetchGeoJSONLayer(layerID, bounds)))
      return updateGeoJSONLayers({ payload: data })
    } catch (error) {
      return fetchGeoJSONLayersFailed({
        error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      })
    }
  })
)

const fetchGeoJSONLayer = async (layerID, bounds) => {
  const baseUrl = 'https://kartta.nba.fi/arcgis/services/WFS/MV_Kulttuuriymparisto/MapServer/WFSServer'
  // const baseUrl = 'https://kartta.nba.fi/arcgis/services/WFS/MV_KulttuuriymparistoSuojellut/MapServer/WFSServer'
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
  const response = await axios.get(url)
  return {
    layerID: layerID,
    geoJSON: response.data
  }
}

const fetchKnowledgeGraphMetadataEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_KNOWLEDGE_GRAPH_METADATA),
  withLatestFrom(state$),
  mergeMap(([action]) => {
    const requestUrl = `${apiUrl}/void/${action.perspectiveID}/${action.resultClass}`
    return ajax({
      url: requestUrl,
      method: 'GET'
    }).pipe(
      map(ajaxResponse => updateKnowledgeGraphMetadata({
        resultClass: action.resultClass,
        data: ajaxResponse.response.data[0],
        sparqlQuery: ajaxResponse.response.sparqlQuery
      })),
      catchError(error => of({
        type: FETCH_KNOWLEDGE_GRAPH_METADATA_FAILED,
        perspectiveID: action.resultClass,
        error: error,
        message: {
          text: backendErrorText,
          title: 'Error'
        }
      }))
    )
  })
)

const rootEpic = combineEpics(
  fetchPaginatedResultsEpic,
  fetchResultsEpic,
  fetchInstanceAnalysisEpic,
  fetchResultCountEpic,
  fetchByURIEpic,
  fetchFacetEpic,
  fetchFacetConstrainSelfEpic,
  fullTextSearchEpic,
  clientFSFetchResultsEpic,
  loadLocalesEpic,
  fetchSimilarDocumentsEpic,
  fetchGeoJSONLayersEpic,
  fetchGeoJSONLayersBackendEpic,
  fetchKnowledgeGraphMetadataEpic
)

export default rootEpic
