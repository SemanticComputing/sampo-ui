import React from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ArcLayer } from 'deck.gl';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// https://deck.gl/#/documentation/getting-started/using-with-react?section=adding-a-base-map

// https://github.com/uber/deck.gl/blob/6.2-release/examples/website/arc/app.js

// http://deck.gl/#/documentation/deckgl-api-reference/layers/arc-layer


// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWtrb25lbiIsImEiOiJjam5vampzZ28xd2dyM3BzNXR0Zzg4azl4In0.eozyF-bBaZbA3ibhvJlJpQ';

const tooltipStyle = {
  position: 'absolute',
  padding: '4px',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  maxWidth: '300px',
  fontSize: '10px',
  zIndex: 9,
  pointerEvents: 'none'
};

class Deck extends React.Component {
  state = {
    viewport: {
      longitude: 10.37,
      latitude: 22.43,
      zoom: 2,
      pitch: 0,
      bearing: 0,
      width: 100,
      height: 100
    },
    tooltip: null
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    this.props.fetchPlaces();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  parseCoordinates = (coords) => {
    if (Array.isArray(coords)) { coords = coords[0]; }
    const arr = [ +coords.long, +coords.lat ];
    return arr;
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  setTooltip(object) {
    this.setState({tooltip: object});
  }

 _onViewportChange = viewport => this.setState({viewport});

 _renderTooltip() {
   if(this.state.tooltip) {
     const { x, y, object } = this.state.tooltip;
     if (object) {
       if (Array.isArray(object.to)) {
         object.to = object.to[0];
       }
       return object && (
         <div style={{...tooltipStyle, top: y, left: x}}>
           <p>Creation place: {object.from.name}</p>
           <p>Last known location: {object.to.name}</p>
         </div>
       );
     }
   }
   return null;
 }

  // getStrokeWidth = manuscriptCount => {
  //   //console.log(manuscriptCount)
  //   if (Array.isArray(manuscriptCount)) {
  //     manuscriptCount = manuscriptCount[0];
  //   }
  //   const min = 1;
  //   const max = 3333;
  //   const minAllowed = 1;
  //   const maxAllowed = 10;
  //   //console.log(this.scaleBetween(manuscriptCount, minAllowed, maxAllowed, min, max))
  //   return this.scaleBetween(parseInt(manuscriptCount), minAllowed, maxAllowed, min, max);
  // }
  //
  // // https://stackoverflow.com/a/31687097
  // scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) => {
  //   return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
  // }

 render() {
   // console.log(this.props.data)
   const layer = new ArcLayer({
     id: 'arc-layer',
     data: this.props.data,
     pickable: true,
     //getStrokeWidth: d => this.getStrokeWidth(d.manuscriptCount),
     getStrokeWidth: 2,
     getSourceColor: [0, 0, 255, 255],
     getTargetColor: [255, 0, 0, 255],
     getSourcePosition: d => this.parseCoordinates(d.from),
     getTargetPosition: d => this.parseCoordinates(d.to),
     onHover: (object) => this.setTooltip(object)
   });

   return (
     <MapGL
       {...this.state.viewport}
       onViewportChange={this._onViewportChange}
       mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} >
       <DeckGL
         viewState={this.state.viewport}
         layers={[layer]}
       />
       {this._renderTooltip()}
     </MapGL>
   );
 }
}

Deck.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default Deck;
