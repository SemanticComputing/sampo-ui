export const FETCH_RESULTS = 'FETCH_RESULTS';
export const UPDATE_QUERY = 'UPDATE_QUERY';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const START_SPINNER = 'START_SPINNER';

export const updateQuery = (query) => ({
  type: UPDATE_QUERY,
  query
});

export const fetchResults = () => ({
  type: FETCH_RESULTS,
});

export const updateDatasets = (datasets) => ({
  type: UPDATE_DATASETS,
  datasets
});

export const startSpinner = () => ({
  type: START_SPINNER,
});

export const updateResults = (results) => ({
  type: UPDATE_RESULTS,
  results
});

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});
