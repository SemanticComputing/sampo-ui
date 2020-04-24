import {
  FETCH_GEOJSON_LAYERS,
  FETCH_GEOJSON_LAYERS_BACKEND,
  UPDATE_GEOJSON_LAYERS,
  UPDATE_MAP_BOUNDS
} from '../actions'

export const INITIAL_STATE = {
  layerData: [],
  updateID: 0,
  fetching: false,
  latMin: 0,
  longMin: 0,
  latMax: 0,
  longMax: 0,
  zoomLevel: 4
}

const leafletMap = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_GEOJSON_LAYERS:
    case FETCH_GEOJSON_LAYERS_BACKEND:
      return {
        ...state,
        fetching: true
      }
    case UPDATE_GEOJSON_LAYERS:
      return {
        ...state,
        layerData: action.payload,
        updateID: state.updateID + 1,
        fetching: false
      }
    case UPDATE_MAP_BOUNDS:
      return {
        ...state,
        latMin: action.bounds.latMin,
        longMin: action.bounds.longMin,
        latMax: action.bounds.latMax,
        longMax: action.bounds.longMax,
        zoomLevel: action.bounds.zoom
      }
    default:
      return state
  }
}

export default leafletMap
