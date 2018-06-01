import {
  UPDATE_GEOJSON
} from '../actions';

export const INITIAL_STATE = {
  geoJSON: {
    'type': '',
    'features': []
  }
};

const map = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_GEOJSON:
      return { ...state, geoJSON: action.geoJSON.geoJSON };
    default:
      return state;
  }
};

export default map;
