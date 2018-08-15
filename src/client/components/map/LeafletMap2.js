import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

const style = {
  width: '100%',
  height: '100%'
};

class LeafletMap2 extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map('map', {
      center: [65.184809, 27.314050],
      zoom: 4,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    this.layer = L.layerGroup().addTo(this.map);
    this.updateMarkers(this.props.markersData);
  }
  componentDidUpdate({ markerPosition }) {
    // check if data has changed
    if (this.props.markersData !== markersData) {
      this.updateMarkers(this.props.markersData);
    }
  }
  render() {
    return <div id="map" style={style} />;
  }
}

LeafletMap2.propTypes = {
  markerPosition: PropTypes.object.isRequired,

};

export default LeafletMap2;
