import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';

const ResultMarker = ({ label, lat, long }) => {
  if (typeof lat === 'undefined' || typeof long === 'undefined') {
    return(null);
  } else {
    const pos = [+lat, +long];
    return (
      <Marker position={pos}>
        <Popup>
          <p>{label}</p>
        </Popup>
      </Marker>
    );
  }
};

ResultMarker.propTypes = {
  label: PropTypes.string.isRequired,
  lat: PropTypes.string.isRequired,
  long: PropTypes.string.isRequired,
};

export default ResultMarker;
