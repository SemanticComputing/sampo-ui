import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/fullscreen.png';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.min.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'Leaflet.Control.Opacity/dist/L.Control.Opacity.css';
import 'Leaflet.Control.Opacity/dist/L.Control.Opacity.js';

const style = {
  width: '100%',
  height: '100%'
};

// https://github.com/pointhi/leaflet-color-markers
const ColorIcon = L.Icon.extend({
  options: {
    shadowUrl: 'img/markers/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
});

class LeafletMap extends React.Component {

  componentDidMount() {
    // https://avaa.tdata.fi/web/kotus/rajapinta
    // Ilmiöt:
    //    kotus:paikkatieto_view
    // Taustakartan rajat:
    //   kotus:pitajat
    //   kotus:rajat-sms-alueosat  murrealueenosat
    //   kotus:rajat-lansi-ita
    //   kotus:rajat-sms-alueet    murrealueet
    this.props.getGeoJSON([
      'kotus:pitajat',
      'kotus:rajat-sms-alueet',
      'kotus:rajat-sms-alueosat',
      'kotus:rajat-lansi-ita'
    ]);

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

    //console.log(this.createNLSUrl('kiinteistojaotus'));

    // Overlays
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

    this.layerControl = L.control.layers(
      baseMaps,
      overlayMaps,
    ).addTo(this.map);

    L.control.opacity(
      overlayMaps, {
        collapsed: true,
        position: 'bottomleft'
      }).addTo(this.map);

  //     map.on('fullscreenchange', function () {
  //     if (map.isFullscreen()) {
  //         console.log('entered fullscreen');
  //     } else {
  //         console.log('exited fullscreen');
  //     }
  // });


    //this.createOpacitySlider();

  }

  componentDidUpdate({ results, mapMode, geoJSONKey }) {
    // check if results data or mapMode have changed
    if (this.props.results !== results || this.props.mapMode !== mapMode) {
      if (this.props.mapMode === 'cluster') {
        this.updateMarkersAndCluster(this.props.results);
      } else {
        this.updateMarkers(this.props.results);
      }
    }
    // check if geoJSON has updated
    if (this.props.geoJSONKey !== geoJSONKey) {
      this.props.geoJSON.map(obj => {
        const layer = L.geoJSON(obj.geoJSON, {
          onEachFeature: this.onEachFeature
        });
        this.layerControl.addOverlay(layer, obj.layerID);
      });
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
    const color = typeof result.markerColor === 'undefined' ? 'grey' : result.markerColor;
    const icon = new ColorIcon({iconUrl: 'img/markers/marker-icon-' + color + '.png'});
    const { lat, long } = result;
    if (typeof lat === 'undefined' || typeof long === 'undefined') {
      return null;
    } else {
      const latLng = [+lat, +long];
      return L.marker(latLng, {icon: icon}).bindPopup(this.createPopUpContent(result));
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

  onEachFeature(feature, layer) {
    let popupContent = '';
    if (feature.id.startsWith('rajat')) {
      popupContent =  '<p>ID: ' + feature.id + '</p>';
    }
    else if (feature.id.startsWith('pitajat')) {
      if (feature.properties.NIMI) {
        popupContent +=  '<p>Nimi: ' + feature.properties.NIMI + '</p>';
      }
      popupContent +=  '<p>ID: ' + feature.id + '</p>';
    }
    layer.bindPopup(popupContent);
  }

  createNLSUrl(layerID) {
    // return 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/' +
    // layerID + '/default/WGS84_Pseudo-Mercator/{z}/{x}/{y}.png';

    return 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts?service=WMTS' +
    '&request=GetTile&version=1.0.0&layer=' + layerID + '&style=default' +
    '&format=image/png&TileMatrixSet=WGS84_Pseudo-Mercator&TileMatrix={z}&TileRow={y}&TileCol={x}';
  }

  createOpacitySlider() {
    L.Control.OpacitySlider = L.Control.extend({
      onAdd: function(map) {
        const slider = L.DomUtil.create('input', 'opacity-slider');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 100;
        return slider;
      },
    });

    L.control.opacitySlider = function(opts) {
      return new L.Control.OpacitySlider(opts);
    };

    L.control.opacitySlider({ position: 'bottomleft' }).addTo(this.map);
  }

  render() {
    return <div id="map" style={style} />;
  }
}

LeafletMap.propTypes = {
  results: PropTypes.array,
  mapMode: PropTypes.string.isRequired,
  geoJSON: PropTypes.array,
  geoJSONKey: PropTypes.number.isRequired,
  getGeoJSON: PropTypes.func.isRequired,
};

export default LeafletMap;
