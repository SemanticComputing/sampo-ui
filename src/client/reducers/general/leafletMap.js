import {
  FETCH_GEOJSON_LAYERS,
  FETCH_GEOJSON_LAYERS_BACKEND,
  CLEAR_GEOJSON_LAYERS,
  UPDATE_GEOJSON_LAYERS,
  FETCH_GEOJSON_LAYERS_FAILED
} from '../../actions'

export const INITIAL_STATE = {
  layerData: [],
  updateID: 0,
  fetching: false
}

const leafletMap = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_GEOJSON_LAYERS:
    case FETCH_GEOJSON_LAYERS_BACKEND:
      return {
        ...state,
        fetching: true
      }
    case FETCH_GEOJSON_LAYERS_FAILED:
      return {
        ...state,
        fetching: false
      }
    case UPDATE_GEOJSON_LAYERS:
      return {
        ...state,
        layerData: action.payload,
        updateID: state.updateID + 1,
        fetching: false
      }
    case CLEAR_GEOJSON_LAYERS:
      return {
        ...state,
        layerData: []
      }
    default:
      return state
  }
}

export default leafletMap
