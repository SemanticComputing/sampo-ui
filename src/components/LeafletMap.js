import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import FullscreenControl from 'react-leaflet-fullscreen';
import ResultMarkerList from './ResultMarkerList';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-fullscreen/dist/styles.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

class LeafletMap extends React.Component {
  state = {
    lat: 64.950916,
    lng: 27.095982,
    zoom: 5,
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map
        center={position}
        zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          <ResultMarkerList results={this.props.results} />
        </MarkerClusterGroup>
        <FullscreenControl position='topright' />
      </Map>
    );
  }
}

LeafletMap.propTypes = {
  results: PropTypes.array.isRequired,
};

export default LeafletMap;
