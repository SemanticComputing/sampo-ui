import React from 'react';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  fontWeight: 300,
  height: 10
};
//
// const getCounts = (suggestion) => suggestion.datasets.map((dataset, index) => (
//   <span key={dataset.datasetId}>
//     {index > 0 ? ', ' : ''}
//     {`${dataset.shortTitle}: ${dataset.count.value}`}
//   </span>
// ));

//  <span> ({getCounts(suggestion)})</span>

const SuggestionItem = ({ suggestion, query, isHighlighted }) => {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);

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
      </div>
    </MenuItem>
  );
};

SuggestionItem.propTypes = {
  suggestion: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

export default SuggestionItem;
