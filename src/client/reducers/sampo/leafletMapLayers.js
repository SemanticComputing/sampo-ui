import {
  UPDATE_GEOJSON_LAYERS
} from '../../actions'

export const INITIAL_STATE = {
  layers: []
}

const leafletMapLayers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_GEOJSON_LAYERS:
      return {
        ...state,
        layers: action.payload
      }
    default:
      return state
  }
}

export default leafletMapLayers
