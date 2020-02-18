import {
  UPDATE_GEOJSON_LAYERS
} from '../../actions'

export const INITIAL_STATE = {
  layerData: [],
  updateID: 0
}

const leafletMapLayers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_GEOJSON_LAYERS:
      return {
        ...state,
        layerData: action.payload,
        updateID: state.updateID + 1
      }
    default:
      return state
  }
}

export default leafletMapLayers
