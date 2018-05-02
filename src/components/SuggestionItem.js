import React from 'react';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { MenuItem } from 'material-ui/Menu';

const styles = {
  fontWeight: 300
};

const SuggestionItem = ({ suggestion, query, isHighlighted }) => {
  const matches = match(suggestion.preferredLabel.value, query);
  const parts = parse(suggestion.preferredLabel.value, matches);

  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      style={styles}
    >
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          ) : (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          );
        })}
        <sup>{suggestion.preferredLabel['xml:lang']}</sup>
        <span>{' ('}
          <span>{suggestion.preferredTypeLabel.value}</span>
          <span>{', '}{suggestion.preferredBroaderAreaLabel.value}</span>
          {')'}
        </span>
      </div>
    </MenuItem>
  );
};

SuggestionItem.propTypes = {
  suggestion: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

export default SuggestionItem;
