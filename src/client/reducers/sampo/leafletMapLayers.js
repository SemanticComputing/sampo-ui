import {
  FETCH_GEOJSON_LAYERS,
  UPDATE_GEOJSON_LAYERS
} from '../../actions'

export const INITIAL_STATE = {
  layerData: [],
  updateID: 0,
  fetching: false
}

const leafletMapLayers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_GEOJSON_LAYERS:
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
    default:
      return state
  }
}

export default leafletMapLayers
