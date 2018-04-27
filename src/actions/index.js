export const UPDATE_QUERY = 'UPDATE_QUERY';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const START_SPINNER = 'START_SPINNER';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const UPDATE_SUGGESTIONS = 'UPDATE_SUGGESTIONS';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
export const FETCH_RESULTS = 'FETCH_RESULTS';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';

export const updateQuery = (query) => ({
  type: UPDATE_QUERY,
  query
});

export const updateDatasets = (datasets) => ({
  type: UPDATE_DATASETS,
  datasets
});

export const startSpinner = () => ({
  type: START_SPINNER,
});

export const fetchSuggestions = () => ({
  type: FETCH_SUGGESTIONS,
});

export const updateSuggestions = (results) => ({
  type: UPDATE_SUGGESTIONS,
  results
});

export const clearSuggestions = () => ({
  type: CLEAR_SUGGESTIONS,
});

export const fetchResults = () => ({
  type: FETCH_RESULTS,
});

export const updateResults = (results) => ({
  type: UPDATE_RESULTS,
  results
});

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});
