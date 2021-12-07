import portalConfig from '../configs/portalConfig.json'
import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { handleDataFetchingAction } from './general/results'
import { handleFacetAction } from './general/facets'
import { handleFacetConstrainSelfAction } from './general/facetsConstrainSelf'
import error from './general/error'
import options from './general/options'
import animation from './general/animation'
import leafletMap from './general/leafletMap'
import { resultsInitialState, facetsInitialState } from './general/initialStates'

const reducers = {
  leafletMap,
  animation,
  options,
  error,
  toastr: toastrReducer
}

const createResultsReducer = (initialState, resultClasses) => {
  const reducerFunc = (state = initialState, action) => {
    if (resultClasses.has(action.resultClass)) {
      return handleDataFetchingAction(state, action, initialState)
    } else return state
  }
  return reducerFunc
}

const createFacetsReducer = (initialState, facetClass) => {
  const reducerFunc = (state = initialState, action) => {
    if (action.facetClass === facetClass) {
      return handleFacetAction(state, action, initialState)
    } else return state
  }
  return reducerFunc
}

const createFacetsConstrainSelfReducer = (initialState, facetClass) => {
  const reducerFunc = (state = initialState, action) => {
    if (action.facetClass === facetClass) {
      return handleFacetConstrainSelfAction(state, action, initialState)
    } else return state
  }
  return reducerFunc
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
  if (perspective.searchMode && perspective.searchMode === 'federated-search') {
    const { default: reducer } = await import(`./${portalID}/clientSideFacetedSearch`)
    reducers.clientSideFacetedSearch = reducer
  } else if (perspective.searchMode && perspective.searchMode === 'full-text-search') {
    const { default: reducer } = await import(`./${portalID}/fullTextSearch`)
    reducers.fullTextSearch = reducer
  } else {
    const { paginatedResultsConfig, resultClasses, properties, facets, maps } = perspective
    const resultsInitialStateFull = {
      ...resultsInitialState,
      ...paginatedResultsConfig,
      maps,
      properties
    }
    const facetsInitialStateFull = {
      ...facetsInitialState,
      facets
    }
    const perspectiveID = perspective.id
    const resultsReducer = createResultsReducer(resultsInitialStateFull, new Set(resultClasses))
    const facetsReducer = createFacetsReducer(facetsInitialStateFull, perspectiveID)
    const facetsConstrainSelfReducer = createFacetsConstrainSelfReducer(facetsInitialStateFull, perspectiveID)
    reducers[perspectiveID] = resultsReducer
    reducers[`${perspectiveID}Facets`] = facetsReducer
    reducers[`${perspectiveID}FacetsConstrainSelf`] = facetsConstrainSelfReducer
  }
}
for (const perspective of perspectiveConfigOnlyInfoPages) {
  const perspectiveID = perspective.id
  const { default: reducer } = await import(`./${portalID}/${perspectiveID}`)
  reducers[perspectiveID] = reducer
}

const combinedReducers = combineReducers(reducers)

export default combinedReducers
