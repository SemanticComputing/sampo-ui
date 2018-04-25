import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'react-leaflet-fullscreen/dist/styles.css';
import FullscreenControl from 'react-leaflet-fullscreen';

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
        <Marker position={position}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
        <FullscreenControl position='topright' />
      </Map>
    );
  }
}

export default LeafletMap;
