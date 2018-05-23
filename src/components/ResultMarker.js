import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';

const ResultMarker = ({ label, lat, long }) => {
  if (typeof lat === 'undefined' || typeof long === 'undefined') {
    return(null);
  } else {
    const pos = [+lat[0].value, +long[0].value];
    return (
      <Marker position={pos}>
        <Popup>
          <p>{label[0].value}</p>
        </Popup>
      </Marker>
    );
  }  
};

ResultMarker.propTypes = {
  label: PropTypes.array.isRequired,
  lat: PropTypes.array.isRequired,
  long: PropTypes.array.isRequired,
};

export default ResultMarker;
