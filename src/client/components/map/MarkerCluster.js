import React from 'react';
import PropTypes from 'prop-types';
import ResultMarker from './ResultMarker';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

const MarkerCluster = ({results}) => {
  const markers = results.map(result => <ResultMarker key={result.s} result={result} />);
  return (
    <MarkerClusterGroup disableClusteringAtZoom={9}>{markers}</MarkerClusterGroup>
  );
};

MarkerCluster.propTypes = {
  results: PropTypes.array.isRequired,
};

export default MarkerCluster;
