import React from 'react';
import PropTypes from 'prop-types';
import ResultMarker from './ResultMarker';

const ResultMarkerList = ({ results }) => {
  const items = results.map(({ s, ...other }) => (
    <ResultMarker
      key={s}
      uri={s}
      {...other} />
  ));
  return <div style={{ display: 'none' }}>{items}</div>;
};

ResultMarkerList.propTypes = {
  results: PropTypes.array.isRequired,
};

export default ResultMarkerList;
