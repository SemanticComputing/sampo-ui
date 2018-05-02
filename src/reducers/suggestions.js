import _ from 'lodash';
import {
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
} from '../actions';

export const getLangValue = (language, valueList) =>
  _.find(valueList, ['xml:lang', language]) || _.first(valueList) || {};

export const updateDatasetSuggestions = ({ language, results }) => {
  return _.map(results, (suggestion) => ({
    ...suggestion,
    preferredLabel: getLangValue(language, suggestion.label),
    preferredTypeLabel: getLangValue(language, suggestion.typeLabel),
    preferredBroaderAreaLabel: getLangValue(language, suggestion.broaderAreaLabel),
  }));
};

export const updateSuggestions = ({ language, results }) => {
  return _.map(results, (result) => ({
    ...result,
    results: updateDatasetSuggestions({ language, results: result.results })
  }));
};

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
