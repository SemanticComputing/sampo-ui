import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';

const ResultMarker = ({ uri, label, typeLabel, broaderAreaLabel, source, lat, long }) => {
  if (typeof lat === 'undefined' || typeof long === 'undefined') {
    return(null);
  } else {
    const pos = [+lat, +long];
    return (
      <Marker position={pos}>
        <Popup>
          <div>
            <h3>{label}</h3>
            <p>Type: {typeLabel}</p>
            <p>Area: {broaderAreaLabel}</p>
            <p>Source: <a target='_blank' rel='noopener noreferrer' href={uri}>{source}</a></p>
          </div>
        </Popup>
      </Marker>
    );
  }
};

ResultMarker.propTypes = {
  label: PropTypes.string.isRequired,
  lat: PropTypes.string,
  long: PropTypes.string,
};

export default ResultMarker;
