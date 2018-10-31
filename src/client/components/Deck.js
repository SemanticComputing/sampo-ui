import React from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ArcLayer } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// https://deck.gl/#/documentation/getting-started/using-with-react?section=adding-a-base-map
// https://github.com/uber/deck.gl/blob/6.2-release/examples/website/arc/app.js
// https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/bart-segments.json
// http://deck.gl/#/documentation/deckgl-api-reference/layers/arc-layer


// https://github.com/uber/deck.gl/blob/6.2-release/examples/website/arc/app.js

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWtrb25lbiIsImEiOiJjam5vampzZ28xd2dyM3BzNXR0Zzg4azl4In0.eozyF-bBaZbA3ibhvJlJpQ';


// Initial viewport settings
const initialViewState = {
  longitude: 10.37,
  latitude: 22.43,
  zoom: 2,
  pitch: 0,
  bearing: 0
};

class Deck extends React.Component {
  componentDidMount() {
    this.props.fetchPlaces();
  }

  parseCoordinates = (coords) => {
    if (Array.isArray(coords)) { coords = coords[0]; }
    const arr = [ +coords.long, +coords.lat ];
    return arr;
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
      getSourceColor: [0, 0, 255, 255],
      getTargetColor: [255, 0, 0, 255],
      getSourcePosition: d => this.parseCoordinates(d.from),
      getTargetPosition: d => this.parseCoordinates(d.to),
      //onHover: ({object}) => console.log(object)
    });

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[layer]}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

Deck.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default Deck;
