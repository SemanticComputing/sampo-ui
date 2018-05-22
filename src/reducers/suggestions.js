import {
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
} from '../actions';

const getShortTitle = (datasetId) => datasetId.split('_').map((part) => part.substr(0, 1)).join('');

export const updateSuggestions = ({ suggestions }) =>
  suggestions.map((suggestion) => ({
    ...suggestion,
    datasets: suggestion.datasets.map((dataset) => ({
      ...dataset,
      shortTitle: getShortTitle(dataset.datasetId)
    }))
  }));

const suggestions = (state = [], action) => {
  switch (action.type) {
    case UPDATE_SUGGESTIONS:
      return updateSuggestions(action);
    case CLEAR_SUGGESTIONS:
      return [];
    default:
      return state;
  }
};

export default suggestions;
