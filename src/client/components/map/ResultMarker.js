import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

const ResultMarker = ({ uri, label, typeLabel, broaderAreaLabel, source, lat, long }) => {
  // const greenIcon = new L.Icon({
  //   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   shadowSize: [41, 41]
  // });

  if (typeof lat === 'undefined' || typeof long === 'undefined') {
    return(null);
  } else {
    const pos = [+lat, +long];
    return (
      <Marker
        position={pos}
      >
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
