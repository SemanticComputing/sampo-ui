import {
  UPDATE_GEOJSON,
  BOUNCE_MARKER,
} from '../actions';

export const INITIAL_STATE = {
  geoJSON: [{
    'type': '',
    'features': []
  }],
  geoJSONKey: 0,
  bouncingMarker: ''
};

const map = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_GEOJSON:
      return {
        ...state,
        geoJSON: action.geoJSON.geoJSON,
        geoJSONKey: state.geoJSONKey + 1
      };
    case BOUNCE_MARKER:
      return {
        ...state,
        bouncingMarker: action.uri
      };
    default:
      return state;
  }
};

export default map;
