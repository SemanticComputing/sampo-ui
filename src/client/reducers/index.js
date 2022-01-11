import portalConfig from '../../configs/portalConfig.json'
import { combineReducers } from 'redux'
import { has } from 'lodash'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { createResultsReducer } from './general/results'
import { createFacetsReducer } from './general/facets'
import { createFacetsConstrainSelfReducer } from './general/facetsConstrainSelf'
import { createFederatedSearchReducer } from './general/federatedSearch'
import { createFullTextSearchReducer } from './general/fullTextSearch'
import error from './general/error'
import options from './general/options'
import animation from './general/animation'
import videoPlayer from './general/videoPlayer'
import leafletMap from './general/leafletMap'
import {
  resultsInitialState,
  facetsInitialState,
  fullTextSearchInitialState,
  federatedSearchInitialState
} from './general/initialStates'

const reducers = {
  leafletMap,
  animation,
  videoPlayer,
  options,
  error,
  toastr: toastrReducer
}

// Create portal spefic reducers based on configs:
const { portalID, perspectives } = portalConfig
const perspectiveConfig = []
const perspectiveConfigOnlyInfoPages = []
for (const perspectiveID of perspectives.searchPerspectives) {
  const { default: perspective } = await import(`../../configs/${portalID}/search_perspectives/${perspectiveID}.json`)
  perspectiveConfig.push(perspective)
}
for (const perspectiveID of perspectives.onlyInstancePages) {
  const { default: perspective } = await import(`../../configs/${portalID}/only_instance_pages/${perspectiveID}.json`)
  perspectiveConfigOnlyInfoPages.push(perspective)
}
for (const perspective of perspectiveConfig) {
  const perspectiveID = perspective.id
  if (perspective.searchMode && perspective.searchMode === 'federated-search') {
    const { datasets, feredatedResultsConfig, maps, facets } = perspective
    for (const facet in facets) {
      facets[facet].selectionsSet = new Set()
      facets[facet].isFetching = false
    }
    const federatedSearchInitialStateFull = {
      ...federatedSearchInitialState,
      ...feredatedResultsConfig,
      datasets,
      maps,
      facets
    }
    const federatedSearchReducer = createFederatedSearchReducer(federatedSearchInitialStateFull, new Set(Object.keys(maps)))
    reducers[perspective.id] = federatedSearchReducer
  } else if (perspective.searchMode && perspective.searchMode === 'full-text-search') {
    const { properties } = perspective
    const fullTextSearchInitialStateFull = {
      ...fullTextSearchInitialState,
      properties
    }
    const fullTextSearchReducer = createFullTextSearchReducer(fullTextSearchInitialStateFull, perspectiveID)
    reducers[perspectiveID] = fullTextSearchReducer
  } else if (perspective.searchMode && perspective.searchMode === 'faceted-search') {
    const { resultClasses, properties, facets, maps } = perspective
    const { paginatedResultsConfig, instanceConfig } = resultClasses[perspectiveID]
    let instancePageResultClasses = {}
    if (instanceConfig && instanceConfig.instancePageResultClasses) {
      instancePageResultClasses = instanceConfig.instancePageResultClasses
    }
    const resultsInitialStateFull = {
      ...resultsInitialState,
      ...paginatedResultsConfig,
      maps,
      properties
    }
    Object.keys(facets).forEach(key => { facets[key].isFetching = false })
    const facetsInitialStateFull = {
      ...facetsInitialState,
      facets
    }
    let extraResultClasses = {}
    for (const resultClass in resultClasses) {
      if (resultClasses[resultClass].resultClasses) {
        extraResultClasses = {
          ...extraResultClasses,
          ...resultClasses[resultClass].resultClasses
        }
      }
    }
    const resultsReducer = createResultsReducer(
      resultsInitialStateFull,
      new Set(Object.keys({ ...resultClasses, ...instancePageResultClasses, ...extraResultClasses })))
    const facetsReducer = createFacetsReducer(facetsInitialStateFull, perspectiveID)
    const facetsConstrainSelfReducer = createFacetsConstrainSelfReducer(facetsInitialStateFull, perspectiveID)
    reducers[perspectiveID] = resultsReducer
    reducers[`${perspectiveID}Facets`] = facetsReducer
    reducers[`${perspectiveID}FacetsConstrainSelf`] = facetsConstrainSelfReducer
  } else if (perspective.searchMode && perspective.searchMode === 'dummy-internal' && has(perspective, 'resultClasses')) {
    const { resultClasses, maps = null } = perspective
    const resultsInitialStateFull = {
      ...resultsInitialState,
      maps
    }
    const resultsReducer = createResultsReducer(resultsInitialStateFull, new Set(Object.keys(resultClasses)))
    reducers[perspectiveID] = resultsReducer
  }
}

for (const perspective of perspectiveConfigOnlyInfoPages) {
  const perspectiveID = perspective.id
  const { resultClasses, properties } = perspective
  const { instanceConfig } = resultClasses[perspectiveID]
  let instancePageResultClasses = {}
  if (instanceConfig && instanceConfig.instancePageResultClasses) {
    instancePageResultClasses = instanceConfig.instancePageResultClasses
  }
  const resultsInitialStateFull = {
    ...resultsInitialState,
    properties
  }
  const resultsReducer = createResultsReducer(resultsInitialStateFull, new Set(Object.keys({ ...resultClasses, ...instancePageResultClasses })))
  reducers[perspectiveID] = resultsReducer
}

const combinedReducers = combineReducers(reducers)

export default combinedReducers
