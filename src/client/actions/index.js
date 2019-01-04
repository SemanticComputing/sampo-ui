export const FETCH_RESULTS = 'FETCH_RESULTS';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const FETCH_RESULTS_FAILED = 'FETCH_RESULTS_FAILED';
export const SORT_RESULTS = 'SORT_RESULTS';

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

export const OPEN_MARKER_POPUP = 'OPEN_MARKER_POPUP';

export const CLEAR_ERROR = 'CLEAR_ERROR';

// Results
export const fetchResults = resultClass => ({
  type: FETCH_RESULTS,
  resultClass
});

export const updateResults = ({ data }) => ({
  type: UPDATE_RESULTS,
  data
});

export const fetchResultsFailed = error => ({
  type: FETCH_RESULTS_FAILED,
  error
});

export const sortResults = sortBy => ({
  type: SORT_RESULTS,
  sortBy
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
export const updateFacet = ({ id, distinctValueCount, values }) => ({
  type: UPDATE_FACET,
  id, distinctValueCount, values
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

export const openMarkerPopup = uri => ({
  type: OPEN_MARKER_POPUP,
  uri
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
