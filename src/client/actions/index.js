export const UPDATE_QUERY = 'UPDATE_QUERY';
export const TOGGLE_DATASET = 'TOGGLE_DATASET';
export const BOUNCE_MARKER = 'BOUNCE_MARKER';
export const OPEN_MARKER_POPUP = 'OPEN_MARKER_POPUP';
export const REMOVE_TEMP_MARKER = 'REMOVE_TEMP_MARKER';
export const START_SPINNER = 'START_SPINNER';

export const FETCH_MANUSCRIPTS = 'FETCH_MANUSCRIPTS';
export const UPDATE_MANUSCRIPTS = 'UPDATE_MANUSCRIPTS';
export const CLEAR_MANUSCRIPTS = 'CLEAR_MANUSCRIPTS';
export const FETCH_MANUSCRIPTS_FAILED = 'FETCH_MANUSCRIPTS_FAILED';

export const UPDATE_PAGE = 'UPDATE_PAGE';

export const FETCH_PLACES = 'FETCH_PLACES';
export const UPDATE_PLACES = 'UPDATE_PLACES';
export const CLEAR_PLACES = 'CLEAR_PLACES';
export const FETCH_PLACES_FAILED = 'FETCH_PLACES_FAILED';

export const FETCH_PLACE = 'FETCH_PLACE';
export const UPDATE_PLACE = 'UPDATE_PLACE';
export const CLEAR_PLACE = 'CLEAR_PLACE';
export const FETCH_PLACE_FAILED = 'FETCH_PLACE_FAILED';

export const FETCH_FACET = 'FETCH_FACET';
export const UPDATE_FACET = 'UPDATE_FACET';
export const CLEAR_FACET = 'CLEAR_FACET';
export const FETCH_FACET_FAILED = 'FETCH_FACET_FAILED';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const OPEN_FACET_DIALOG = 'OPEN_FACET_DIALOG';
export const CLOSE_FACET_DIALOG = 'CLOSE_FACET_DIALOG';

export const SORT_RESULTS = 'SORT_RESULTS';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const updateQuery = query => ({
  type: UPDATE_QUERY,
  query
});

export const toggleDataset = dataset => ({
  type: TOGGLE_DATASET,
  dataset
});

export const bounceMarker = uri => ({
  type: BOUNCE_MARKER,
  uri
});

export const openMarkerPopup = uri => ({
  type: OPEN_MARKER_POPUP,
  uri
});

export const removeTempMarker = () => ({
  type: REMOVE_TEMP_MARKER,
});

// Manuscripts
export const fetchManuscripts = () => ({
  type: FETCH_MANUSCRIPTS,
});
export const updateManuscripts = ({ data }) => ({
  type: UPDATE_MANUSCRIPTS,
  data
});
export const clearManuscripts = () => ({
  type: CLEAR_MANUSCRIPTS,
});
export const fetchManuscriptsFailed = error => ({
  type: FETCH_MANUSCRIPTS_FAILED,
  error
});

export const updatePage = page => ({
  type: UPDATE_PAGE,
  page
});

// Places
export const fetchPlaces = variant => ({
  type: FETCH_PLACES,
  variant
});
export const updatePlaces = ({ places }) => ({
  type: UPDATE_PLACES,
  places
});
export const clearPlaces = () => ({
  type: CLEAR_PLACES,
});
export const fetchPlacesFailed = error => ({
  type: FETCH_PLACES_FAILED,
  error
});
export const fetchPlace = placeId => ({
  type: FETCH_PLACE,
  placeId
});
export const updatePlace = ({ place }) => ({
  type: UPDATE_PLACE,
  place
});
export const clearPlace = () => ({
  type: CLEAR_PLACES,
});
export const fetchPlaceFailed = error => ({
  type: FETCH_PLACES_FAILED,
  error
});

// Facet
export const openFacetDialog = property => ({
  type: OPEN_FACET_DIALOG,
  property
});
export const closeFacetDialog = () => ({
  type: CLOSE_FACET_DIALOG,
});
export const fetchFacet = id => ({
  type: FETCH_FACET,
  id
});
export const updateFacet = ({ id, facetValues }) => ({
  type: UPDATE_FACET,
  id, facetValues
});
export const clearFacet = () => ({
  type: CLEAR_FACET,
});
export const fetchFacetFailed = error => ({
  type: FETCH_FACET_FAILED,
  error
});
export const updateFilter = filter => ({
  type: UPDATE_FILTER,
  filter
});

export const sortResults = sortBy => ({
  type: SORT_RESULTS,
  sortBy
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
