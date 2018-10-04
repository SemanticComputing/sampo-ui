export const UPDATE_QUERY = 'UPDATE_QUERY';
export const TOGGLE_DATASET = 'TOGGLE_DATASET';
export const BOUNCE_MARKER = 'BOUNCE_MARKER';
export const OPEN_MARKER_POPUP = 'OPEN_MARKER_POPUP';
export const REMOVE_TEMP_MARKER = 'REMOVE_TEMP_MARKER';
export const START_SPINNER = 'START_SPINNER';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const FETCH_SUGGESTIONS_FAILED = 'FETCH_SUGGESTIONS_FAILED';
export const UPDATE_SUGGESTIONS = 'UPDATE_SUGGESTIONS';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';

export const FETCH_RESULTS = 'FETCH_RESULTS';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const FETCH_RESULTS_FAILED = 'FETCH_RESULTS_FAILED';

export const FETCH_MANUSCRIPTS = 'FETCH_MANUSCRIPTS';
export const UPDATE_MANUSCRIPTS = 'UPDATE_MANUSCRIPTS';
export const CLEAR_MANUSCRIPTS = 'CLEAR_MANUSCRIPTS';
export const FETCH_MANUSCRIPTS_FAILED = 'FETCH_MANUSCRIPTS_FAILED';

export const FETCH_PLACES = 'FETCH_PLACES';
export const UPDATE_PLACES = 'UPDATE_PLACES';
export const CLEAR_PLACES = 'CLEAR_PLACES';
export const FETCH_PLACES_FAILED = 'FETCH_PLACES_FAILED';

export const UPDATE_RESULTS_FILTER = 'UPDATE_RESULTS_FILTER';
export const SORT_RESULTS = 'SORT_RESULTS';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';
export const UPDATE_RESULT_FORMAT = 'UPDATE_RESULT_FORMAT';
export const UPDATE_MAP_MODE = 'UPDATE_MAP_MODE';
export const GET_GEOJSON = 'GET_GEOJSON';
export const UPDATE_GEOJSON = 'UPDATE_GEOJSON';
export const GET_GEOJSON_FAILED = 'GET_GEOJSON_FAILED';

export const updateQuery = (query) => ({
  type: UPDATE_QUERY,
  query
});

export const toggleDataset = (dataset) => ({
  type: TOGGLE_DATASET,
  dataset
});

export const bounceMarker = (uri) => ({
  type: BOUNCE_MARKER,
  uri
});

export const openMarkerPopup = (uri) => ({
  type: OPEN_MARKER_POPUP,
  uri
});

export const removeTempMarker = () => ({
  type: REMOVE_TEMP_MARKER,
});

export const startSpinner = () => ({
  type: START_SPINNER,
});

export const fetchSuggestions = () => ({
  type: FETCH_SUGGESTIONS,
});

export const fetchSuggestionsFailed = (error) => ({
  type: FETCH_SUGGESTIONS_FAILED,
  error
});



export const updateSuggestions = ({ suggestions }) => ({
  type: UPDATE_SUGGESTIONS,
  suggestions
});

export const clearSuggestions = () => ({
  type: CLEAR_SUGGESTIONS,
});

// Results
export const fetchResults = () => ({
  type: FETCH_RESULTS,
});

export const updateResults = ({ results }) => ({
  type: UPDATE_RESULTS,
  results
});

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});

export const fetchResultsFailed = (error) => ({
  type: FETCH_RESULTS_FAILED,
  error
});

// Manuscripts
export const fetchManuscripts = (page) => ({
  type: FETCH_MANUSCRIPTS,
  page
});

export const updateManuscripts = ({ manuscripts }) => ({
  type: UPDATE_MANUSCRIPTS,
  manuscripts
});

export const clearManuscripts = () => ({
  type: CLEAR_MANUSCRIPTS,
});

export const fetchManuscriptsFailed = (error) => ({
  type: FETCH_MANUSCRIPTS_FAILED,
  error
});

// Places
export const fetchPlaces = () => ({
  type: FETCH_PLACES,
});

export const updatePlaces = ({ places }) => ({
  type: UPDATE_PLACES,
  places
});

export const clearPlaces = () => ({
  type: CLEAR_PLACES,
});

export const fetchPlacesFailed = (error) => ({
  type: FETCH_PLACES_FAILED,
  error
});






export const updateResultsFilter = (filter) => ({
  type: UPDATE_RESULTS_FILTER,
  filter
});

export const sortResults = (options) => ({
  type: SORT_RESULTS,
  options
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

export const updateLanguage = (language) => ({
  type: UPDATE_LANGUAGE,
  language
});

export const updateResultFormat = (resultFormat) => ({
  type: UPDATE_RESULT_FORMAT,
  resultFormat
});

export const updateMapMode = (mapMode) => ({
  type: UPDATE_MAP_MODE,
  mapMode
});

export const getGeoJSON = (layerIDs) => ({
  type: GET_GEOJSON,
  layerIDs
});

export const updateGeoJSON = (geoJSON) => ({
  type: UPDATE_GEOJSON,
  geoJSON
});

export const getGeoJSONFailed = (error) => ({
  type: GET_GEOJSON_FAILED,
  error
});
