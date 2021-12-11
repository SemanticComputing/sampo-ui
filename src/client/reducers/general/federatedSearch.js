import {
  CLIENT_FS_UPDATE_QUERY,
  CLIENT_FS_TOGGLE_DATASET,
  CLIENT_FS_FETCH_RESULTS,
  CLIENT_FS_FETCH_RESULTS_FAILED,
  CLIENT_FS_UPDATE_RESULTS,
  CLIENT_FS_CLEAR_RESULTS,
  CLIENT_FS_UPDATE_FACET,
  CLIENT_FS_SORT_RESULTS,
  UPDATE_MAP_BOUNDS
} from '../../actions'
import { handleDataFetchingAction } from './results'

export const createFederatedSearchReducer = (initialState, resultClassesForMapBounds) => {
  const reducerFunc = (state = initialState, action) => {
    switch (action.type) {
      case CLIENT_FS_UPDATE_QUERY:
        return { ...state, query: action.query || '' }
      case CLIENT_FS_TOGGLE_DATASET:
        return {
          ...state,
          suggestions: [],
          results: null,
          datasets: {
            ...state.datasets,
            [action.dataset]: {
              ...state.datasets[action.dataset],
              selected: !state.datasets[action.dataset].selected
            }
          }
        }
      case CLIENT_FS_FETCH_RESULTS:
        return {
          ...state,
          [`${action.jenaIndex}ResultsFetching`]: true
        }
      case CLIENT_FS_FETCH_RESULTS_FAILED:
        return {
          ...state,
          textResultsFetching: false,
          spatialResultsFetching: false
        }
      case CLIENT_FS_CLEAR_RESULTS:
        return {
          ...state,
          results: null,
          fetchingResults: false,
          query: initialState.query,
          facets: initialState.facets,
          facetUpdateID: ++state.facetUpdateID,
          lastlyUpdatedFacet: null,
          maps: {
            ...state.maps,
            // reset center and zoom for maps that are used for results:
            clientFSMapClusters: initialState.maps.clientFSMapClusters,
            clientFSMapMarkers: initialState.maps.clientFSMapMarkers
          }
        }
      case CLIENT_FS_UPDATE_RESULTS:
        return {
          ...state,
          results: action.results,
          [`${action.jenaIndex}ResultsFetching`]: false
        }
      case CLIENT_FS_UPDATE_FACET:
        return clientFSUpdateFacet(state, action)
      case CLIENT_FS_SORT_RESULTS:
        return {
          ...state,
          sortBy: action.options.sortBy,
          sortDirection: action.options.sortDirection
        }
      case UPDATE_MAP_BOUNDS:
        if (resultClassesForMapBounds.has(action.resultClass)) {
          return handleDataFetchingAction(state, action)
        } else {
          return state
        }
      default:
        return state
    }
  }
  return reducerFunc
}

const clientFSUpdateFacet = (state, action) => {
  const { facetID, value, latestValues } = action
  const newSelectionsSet = new Set(state.facets[facetID].selectionsSet)
  if (newSelectionsSet.has(value)) {
    newSelectionsSet.delete(value)
  } else {
    newSelectionsSet.add(value)
  }
  const updatedFacets = {
    ...state.facets,
    [facetID]: {
      ...state.facets[facetID],
      selectionsSet: newSelectionsSet
    }
  }
  return {
    ...state,
    facetUpdateID: ++state.facetUpdateID,
    facets: updatedFacets,
    lastlyUpdatedFacet: {
      facetID: facetID,
      values: latestValues
    }
  }
}
