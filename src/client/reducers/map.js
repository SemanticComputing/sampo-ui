import {
  UPDATE_GEOJSON,
  BOUNCE_MARKER,
  OPEN_MARKER_POPUP,
  REMOVE_TEMP_MARKER
} from '../actions';

export const INITIAL_STATE = {
  geoJSON: [{
    'type': '',
    'features': []
  }],
  geoJSONKey: 0,
  bouncingMarker: '',
  popupMarker: '',
  bouncingMarkerKey: 0,
  openPopupMarkerKey: 0,
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
        bouncingMarker: action.uri,
        bouncingMarkerKey: state.bouncingMarkerKey + 1
      };
    case OPEN_MARKER_POPUP:
      return {
        ...state,
        popupMarker: action.uri,
        openPopupMarkerKey: state.openPopupMarkerKey + 1
      };
    case REMOVE_TEMP_MARKER:
      return {
        ...state,
        bouncingMarker: '',
      };
    default:
      return state;
  }
};

export default map;
