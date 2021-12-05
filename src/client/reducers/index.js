import portalConfig from '../configs/PortalConfig'
import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'

// Import and add general reducers:
import error from './general/error'
import options from './general/options'
import animation from './general/animation'
import leafletMap from './general/leafletMap'
const reducers = {
  leafletMap,
  animation,
  options,
  error,
  toastr: toastrReducer
}

// Import and add portal spefic reducers:
const { portalID } = portalConfig
const { perspectiveConfig } = await import(`../configs/${portalID}/PerspectiveConfig`)
const { perspectiveConfigOnlyInfoPages } = await import(`../configs/${portalID}/PerspectiveConfigOnlyInfoPages`)
for (const perspective of perspectiveConfig) {
  if (perspective.searchMode && perspective.searchMode === 'federated-search') {
    const { default: reducer } = await import(`./${portalID}/clientSideFacetedSearch`)
    reducers.clientSideFacetedSearch = reducer
  } else if (perspective.searchMode && perspective.searchMode === 'full-text-search') {
    const { default: reducer } = await import(`./${portalID}/fullTextSearch`)
    reducers.fullTextSearch = reducer
  } else {
    const perspectiveID = perspective.id
    const { default: reducer } = await import(`./${portalID}/${perspectiveID}`)
    const { default: facetReducer } = await import(`./${portalID}/${perspectiveID}Facets`)
    let facetConstrainselfReducer = null
    try {
      const { default: importedFacetConstrainselfReducer } = await import(`./${portalID}/${perspectiveID}FacetsConstrainSelf`)
      facetConstrainselfReducer = importedFacetConstrainselfReducer
    } catch (error) { }
    reducers[perspectiveID] = reducer
    reducers[`${perspectiveID}Facets`] = facetReducer
    if (facetConstrainselfReducer) {
      reducers[`${perspectiveID}FacetsConstrainSelf`] = facetConstrainselfReducer
    }
  }
}
for (const perspective of perspectiveConfigOnlyInfoPages) {
  const perspectiveID = perspective.id
  const { default: reducer } = await import(`./${portalID}/${perspectiveID}`)
  reducers[perspectiveID] = reducer
}

const reducer = combineReducers(reducers)

export default reducer
