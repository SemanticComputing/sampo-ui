export const updateQuery = (query) => ({
  type: 'UPDATE_QUERY',
  query
});

export const fetchResults = () => ({
  type: 'FETCH_RESULTS',
  meta: {
    debounce: {
      time: 750
    }
  }
});

export const updateDatasets = (datasets) => ({
  type: 'UPDATE_DATASETS',
  datasets
});

export const startSpinner = () => ({
  type: 'START_SPINNER',
});

export const updateResults = (results) => ({
  type: 'UPDATE_RESULTS',
  results
});

export const clearResults = () => ({
  type: 'CLEAR_RESULTS',
});
