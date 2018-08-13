import React from 'react';
import PropTypes from 'prop-types';
import ResultMarker from './ResultMarker';

const ResultMarkerList = ({ results }) => {
  const markers = results.map(result => <ResultMarker key={result.s} result={result} />);
  return markers;
};

ResultMarkerList.propTypes = {
  results: PropTypes.array.isRequired,
};

export default ResultMarkerList;
