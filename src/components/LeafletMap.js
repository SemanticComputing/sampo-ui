import React from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  LayersControl,
  TileLayer
} from 'react-leaflet';
import FullscreenControl from 'react-leaflet-fullscreen';
import ResultMarkerList from './ResultMarkerList';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-fullscreen/dist/styles.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import SimpleSlider from './SimpleSlider';
import Control from 'react-leaflet-control';

class LeafletMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: 64.950916,
      lng: 27.095982,
      zoom: 5,
      opacity: 1.0
    };
  }

  handleSetOpacity = (value) => {
    this.setState({ opacity: +value / 100 });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
  
    return (
      <Map
        center={position}
        zoom={this.state.zoom}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Karelian maps">
            <TileLayer
              attribution="SeCo"
              url="http:///mapwarper.onki.fi/mosaics/tile/4/{z}/{x}/{y}.png"
              opacity={this.state.opacity}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Western Front July 1917">
            <TileLayer
              attribution="SeCo"
              url="http://mapwarper.net/mosaics/tile/844/{z}/{x}/{y}.png"
              opacity={this.state.opacity}
            />
          </LayersControl.Overlay>

        </LayersControl>
        <MarkerClusterGroup>
          <ResultMarkerList results={this.props.results} />
        </MarkerClusterGroup>
        <FullscreenControl position='topright' />
        <Control position="topright" >
          <SimpleSlider
            sliderValue={this.props.sliderValue}
            setOpacity={this.handleSetOpacity}
          />
        </Control>
      </Map>
    );
  }
}

LeafletMap.propTypes = {
  results: PropTypes.array.isRequired,
  sliderValue: PropTypes.number.isRequired,
};

export default LeafletMap;
