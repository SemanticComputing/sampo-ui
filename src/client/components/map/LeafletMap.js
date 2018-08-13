import React from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  LayersControl,
  TileLayer,
  GeoJSON
} from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;

// import FullscreenControl from 'react-leaflet-fullscreen';
// import 'react-leaflet-fullscreen/dist/styles.css';

import ResultMarkerList from './ResultMarkerList';
import MarkerCluster from './MarkerCluster';

// import SimpleSlider from './SimpleSlider';
// import Control from 'react-leaflet-control';
//
// import { GoogleLayer } from 'react-leaflet-google';
// https://console.developers.google.com/apis/credentials?project=hipla-187309
// const key = 'AIzaSyCKWw5FjhwLsfp_l2gjVAifPkT)3cxGXhA4';
// const road = 'ROADMAP'; // displays the default road map view. This is the default map type.
// const satellite = 'SATELLITE'; // displays Google Earth satellite images.
// const hybrid = 'HYBRID'; // displays a mixture of normal and satellite views.
// const terrain = 'TERRAIN'; // displays a physical map based on terrain information.

class LeafletMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: 65.184809,
      lng: 27.314050,
      zoom: 4,
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


  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <Map
        center={position}
        zoom={this.state.zoom}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          {/* <BaseLayer name='Google Maps Roads'>
            <GoogleLayer googlekey={key}  maptype={road}/>
            </BaseLayer>
            <BaseLayer name='Google Maps Satellite'>
            <GoogleLayer googlekey={key}  maptype={satellite} />
            </BaseLayer>
            <BaseLayer name='Google Maps Hybrid'>
            <GoogleLayer googlekey={key}  maptype={hybrid} />
            </BaseLayer>
            <BaseLayer name='Google Maps Terrain'>
            <GoogleLayer googlekey={key}  maptype={terrain} />
            </BaseLayer>
            <BaseLayer name="MML Maastokartta">
            <TileLayer
              attribution="SeCo"
              url="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
            />
          </BaseLayer> */}
          <Overlay name="Karelian maps">
            <TileLayer
              attribution="SeCo"
              url="http:///mapwarper.onki.fi/mosaics/tile/4/{z}/{x}/{y}.png"
              opacity={this.state.opacity}
            />
          </Overlay>
          <Overlay name="Senate atlas">
            <TileLayer
              attribution="SeCo"
              url="http:///mapwarper.onki.fi/mosaics/tile/5/{z}/{x}/{y}.png"
              opacity={this.state.opacity}
            />
          </Overlay>
          <Overlay name="Western Front July 1917">
            <TileLayer
              attribution="SeCo"
              url="http://mapwarper.net/mosaics/tile/844/{z}/{x}/{y}.png"
              opacity={this.state.opacity}
            />
          </Overlay>
        </LayersControl>
        <GeoJSON
          key={this.props.geoJSONKey}
          data={this.props.geoJSON}
          onEachFeature={this.handleOnEachFeature}
        />
        {this.props.mapMode == 'cluster' && this.props.results.length > 0 &&
          <MarkerCluster results={this.props.results} />
        }
        {this.props.mapMode == 'noCluster' &&  this.props.results.length > 0 &&
          <ResultMarkerList results={this.props.results} />}
        {/* <FullscreenControl position='topright' /> */}
        {/* <Control position="topright" >
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
        </Control> */}
      </Map>
    );
  }
}

LeafletMap.propTypes = {
  results: PropTypes.array.isRequired,
  sliderValue: PropTypes.number.isRequired,
  geoJSON: PropTypes.object,
  geoJSONKey: PropTypes.number,
  getGeoJSON: PropTypes.func.isRequired,
  mapMode: PropTypes.string.isRequired
};

export default LeafletMap;
