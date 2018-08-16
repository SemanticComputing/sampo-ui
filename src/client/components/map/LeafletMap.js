import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';

const style = {
  width: '100%',
  height: '100%'
};

class LeafletMap2 extends React.Component {

  componentDidMount() {

    // Base layers
    const OSMBaseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    const topographicalMapNLS = L.tileLayer(this.createNLSUrl('maastokartta'), {
      attribution: 'National Land Survey of Finland'
    });

    //https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/asiantuntevalle-kayttajalle/kartta-ja-paikkatietojen-rajapintapalvelut-19
    const backgroundMapNLS = L.tileLayer(this.createNLSUrl('taustakartta'), {
      attribution: 'National Land Survey of Finland'
    });

    // const accessibleMapNLS  = L.tileLayer(this.createNLSUrl('selkokartta'), {
    //   attribution: 'National Land Survey of Finland'
    // });
    //
    // const aerialPhotoMapNLS = L.tileLayer(this.createNLSUrl('ortokuva'), {
    //   attribution: 'National Land Survey of Finland'
    // });

    // Overlay layers
    const realEstateMapNLS = L.tileLayer(this.createNLSUrl('kiinteistojaotus'), {
      attribution: 'National Land Survey of Finland'
    });

    const realEstateIdMapNLS = L.tileLayer(this.createNLSUrl('kiinteistotunnukset'), {
      attribution: 'National Land Survey of Finland'
    });

    const karelianMaps = L.tileLayer('http:///mapwarper.onki.fi/mosaics/tile/4/{z}/{x}/{y}.png', {
      attribution: 'SeCo'
    });

    const senateAtlas = L.tileLayer('http:///mapwarper.onki.fi/mosaics/tile/5/{z}/{x}/{y}.png', {
      attribution: 'SeCo'
    });

    const westernFront = L.tileLayer('http://mapwarper.net/mosaics/tile/844/{z}/{x}/{y}.png', {
      attribution: 'SeCo'
    });

    // Result marker layer
    this.resultMarkerLayer = L.layerGroup();

    if (this.props.mapMode === 'cluster') {
      this.updateMarkersAndCluster(this.props.results);
    } else {
      this.updateMarkers(this.props.results);
    }

    // create map
    this.map = L.map('map', {
      center: [65.184809, 27.314050],
      zoom: 4,
      layers: [
        OSMBaseLayer,
        this.resultMarkerLayer
      ],
      fullscreenControl: true,
    });

    // layer controls
    const baseMaps = {
      'OpenStreetMap': OSMBaseLayer,
      'Topographical map (National Land Survey of Finland)': topographicalMapNLS,
      'Background map (National Land Survey of Finland)': backgroundMapNLS,
    };
    const overlayMaps = {
      'Search results': this.resultMarkerLayer,
      'Real estate boundaries (National Land Survey of Finland)': realEstateMapNLS,
      'Real estate ids (National Land Survey of Finland)': realEstateIdMapNLS,
      'Karelian maps (MapWarper)': karelianMaps,
      'Senate atlas (MapWarper)': senateAtlas,
      'Western Front July 1917 (MapWarper)': westernFront
    };
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);
  }

  componentDidUpdate({ results, mapMode }) {
    // check if results data or mapMode have changed
    if (this.props.results !== results || this.props.mapMode !== mapMode) {
      if (this.props.mapMode === 'cluster') {
        this.updateMarkersAndCluster(this.props.results);
      } else {
        this.updateMarkers(this.props.results);
      }
    }
  }

  updateMarkers(results) {
    this.resultMarkerLayer.clearLayers();
    results.forEach(result => {
      const marker = this.createMarker(result);
      marker == null ? null : marker.addTo(this.resultMarkerLayer);
    });
  }

  updateMarkersAndCluster(results) {
    this.resultMarkerLayer.clearLayers();
    const clusterer = L.markerClusterGroup();
    results.forEach(result => {
      const marker = this.createMarker(result);
      marker == null ? null : clusterer.addLayer(marker);
    });
    clusterer.addTo(this.resultMarkerLayer);
  }

  createMarker(result) {
    const { lat, long } = result;
    if (typeof lat === 'undefined' || typeof long === 'undefined') {
      return null;
    } else {
      const latLng = [+lat, +long];
      return L.marker(latLng).bindPopup(this.createPopUpContent(result));
    }
  }

  createPopUpContent(result) {
    const popUpTemplate = `
      <h3>{label}</h3>
      <p>Type: {typeLabel}</p>
      <p>Area: {broaderAreaLabel}</p>
      <p>Source: <a target='_blank' rel='noopener noreferrer' href={s}>{source}</a></p>
      `;
    return L.Util.template(popUpTemplate, result);
  }

  createNLSUrl(layerID) {
    return 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts?service=WMTS' +
    '&request=GetTile&version=1.0.0&layer=' + layerID + '&style=default' +
    '&format=image/png&TileMatrixSet=WGS84_Pseudo-Mercator&TileMatrix={z}&TileRow={y}&TileCol={x}';
  }

  render() {
    return <div id="map" style={style} />;
  }
}

LeafletMap2.propTypes = {
  results: PropTypes.array,
  mapMode: PropTypes.string.isRequired
};

export default LeafletMap2;
