import React from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  LayersControl,
  TileLayer,
  GeoJSON
} from 'react-leaflet';
import FullscreenControl from 'react-leaflet-fullscreen';
import ResultMarkerList from './ResultMarkerList';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-fullscreen/dist/styles.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import SimpleSlider from './SimpleSlider';
import Control from 'react-leaflet-control';
import { GoogleLayer } from 'react-leaflet-google';

// https://console.developers.google.com/apis/credentials?project=hipla-187309
const key = 'AIzaSyCKWw5FjhwLsfp_l2gjVAifPkT3cxGXhA4';
const road = 'ROADMAP'; // displays the default road map view. This is the default map type.
const satellite = 'SATELLITE'; // displays Google Earth satellite images.
const hybrid = 'HYBRID'; // displays a mixture of normal and satellite views.
const terrain = 'TERRAIN'; // displays a physical map based on terrain information.


class LeafletMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: 63.78248603116502,
      lng: 40.10009765625001,
      zoom: 5,
      opacity: 1.0
    };
  }

  handleSetOpacity = (value) => {
    this.setState({ opacity: +value / 100 });
  }

  handleOnEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.NIMI) {
      layer.bindPopup('<p>Nimi: ' + feature.properties.NIMI + '</p></p>ID: ' + feature.id + '</p>');
    }
  }
  // 
  // <LayersControl.BaseLayer checked name='Google Maps Roads'>
  //   <GoogleLayer googlekey={key}  maptype={road}/>
  // </LayersControl.BaseLayer>
  // <LayersControl.BaseLayer name='Google Maps Satellite'>
  //   <GoogleLayer googlekey={key}  maptype={satellite} />
  // </LayersControl.BaseLayer>
  // <LayersControl.BaseLayer name='Google Maps Hybrid'>
  //   <GoogleLayer googlekey={key}  maptype={hybrid} />
  // </LayersControl.BaseLayer>
  // <LayersControl.BaseLayer name='Google Maps Terrain'>
  //   <GoogleLayer googlekey={key}  maptype={terrain} />
  // </LayersControl.BaseLayer>
  //

  // <MarkerClusterGroup
  //   disableClusteringAtZoom={9}
  // >
  //   <ResultMarkerList results={this.props.results} />
  // </MarkerClusterGroup>

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map
        center={position}
        zoom={this.state.zoom}
      >
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
          <LayersControl.Overlay name="Senate atlas">
            <TileLayer
              attribution="SeCo"
              url="http:///mapwarper.onki.fi/mosaics/tile/5/{z}/{x}/{y}.png"
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
        <GeoJSON
          key={this.props.geoJSONKey}
          data={this.props.geoJSON}
          onEachFeature={this.handleOnEachFeature}
        />
        <ResultMarkerList results={this.props.results} />
        <FullscreenControl position='topright' />
        <Control position="topright" >
          <SimpleSlider
            sliderValue={this.props.sliderValue}
            setOpacity={this.handleSetOpacity}
          />
        </Control>
        <Control position="topright" >
          <button
            onClick={this.props.getGeoJSON}
          >
            Kotus pitäjät
          </button>
        </Control>
      </Map>
    );
  }
}

LeafletMap.propTypes = {
  results: PropTypes.array.isRequired,
  sliderValue: PropTypes.number.isRequired,
  geoJSON: PropTypes.object,
  geoJSONKey: PropTypes.number,
  getGeoJSON: PropTypes.func.isRequired
};

export default LeafletMap;
