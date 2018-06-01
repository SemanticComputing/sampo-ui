import {
  UPDATE_GEOJSON
} from '../actions';

export const INITIAL_STATE = {
  geoJSON: {
    'type': '',
    'features': []
  },
  geoJSONKey: 0
};

const map = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_GEOJSON:
      return {
        ...state,
        geoJSON: action.geoJSON.geoJSON,
        geoJSONKey: state.geoJSONKey + 1
      };
    default:
      return state;
  }
};

export default map;
