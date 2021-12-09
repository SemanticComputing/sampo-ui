import portalConfig from '../configs/portalConfig.json'
import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { createResultsReducer } from './general/results'
import { createFacetsReducer } from './general/facets'
import { createFacetsConstrainSelfReducer } from './general/facetsConstrainSelf'
import { createFullTextSearchReducer } from './general/fullTextSearch'
import error from './general/error'
import options from './general/options'
import animation from './general/animation'
import leafletMap from './general/leafletMap'
import { resultsInitialState, facetsInitialState, fullTextSearchInitialState } from './general/initialStates'

const reducers = {
  leafletMap,
  animation,
  options,
  error,
  toastr: toastrReducer
}

// Create portal spefic reducers based on configs:
const { portalID, perspectives } = portalConfig
const perspectiveConfig = []
const perspectiveConfigOnlyInfoPages = []
for (const perspectiveID of perspectives.searchPerspectives) {
  const { default: perspective } = await import(`../configs/${portalID}/perspective_configs/search_perspectives/${perspectiveID}.json`)
  perspectiveConfig.push(perspective)
}
for (const perspectiveID of perspectives.onlyInstancePages) {
  const { default: perspective } = await import(`../configs/${portalID}/perspective_configs/only_instance_pages/${perspectiveID}.json`)
  perspectiveConfigOnlyInfoPages.push(perspective)
}
for (const perspective of perspectiveConfig) {
  const perspectiveID = perspective.id
  if (perspective.searchMode && perspective.searchMode === 'federated-search') {
    const { default: reducer } = await import('./general/clientSideFacetedSearch')
    reducers.clientSideFacetedSearch = reducer
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
    const { paginatedResultsConfig } = resultClasses[perspectiveID]
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
    const resultsReducer = createResultsReducer(resultsInitialStateFull, new Set(Object.keys(resultClasses)))
    const facetsReducer = createFacetsReducer(facetsInitialStateFull, perspectiveID)
    const facetsConstrainSelfReducer = createFacetsConstrainSelfReducer(facetsInitialStateFull, perspectiveID)
    reducers[perspectiveID] = resultsReducer
    reducers[`${perspectiveID}Facets`] = facetsReducer
    reducers[`${perspectiveID}FacetsConstrainSelf`] = facetsConstrainSelfReducer
  }
}

for (const perspective of perspectiveConfigOnlyInfoPages) {
  const perspectiveID = perspective.id
  const { resultClasses, properties } = perspective
  const resultsInitialStateFull = {
    ...resultsInitialState,
    properties
  }
  const resultsReducer = createResultsReducer(resultsInitialStateFull, new Set(Object.keys(resultClasses)))
  reducers[perspectiveID] = resultsReducer
}

const combinedReducers = combineReducers(reducers)

export default combinedReducers
