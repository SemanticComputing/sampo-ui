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
import 'leaflet.smooth_marker_bouncing/leaflet.smoothmarkerbouncing.js';
import 'Leaflet.extra-markers/dist/js/leaflet.extra-markers.min.js';
import 'Leaflet.extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'Leaflet.extra-markers/dist/img/markers_default.png';
import 'Leaflet.extra-markers/dist/img/markers_shadow.png';

const style = {
  width: '100%',
  height: '100%'
};

// https://github.com/pointhi/leaflet-color-markers
// const ColorIcon = L.Icon.extend({
//   options: {
//     shadowUrl: 'img/markers/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
//   }
// });

class LeafletMap extends React.Component {

  componentDidMount() {
    //this.props.fetchManuscripts();
    this.props.fetchPlaces();

    // Base layers
    const OSMBaseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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

    // Marker layers
    this.resultMarkerLayer = L.layerGroup();

    this.bouncingMarkerObj = null;
    this.popupMarkerObj = null;

    if (this.props.mapMode === 'cluster') {
      this.updateMarkersAndCluster(this.props.results);
    } else {
      this.updateMarkers(this.props.results);
    }

    // create map
    this.leafletMap = L.map('map', {
      center: [42.94, 20.57],
      zoom: 2,
      layers: [
        OSMBaseLayer,
        this.resultMarkerLayer,
      ],
      fullscreenControl: true,
    });

    // layer controls
    const baseMaps = {
      'OpenStreetMap': OSMBaseLayer,
    };
    const overlayMaps = {
      'Search results': this.resultMarkerLayer,
      'Karelian maps (MapWarper)': karelianMaps,
      'Senate atlas (MapWarper)': senateAtlas,
      'Western Front July 1917 (MapWarper)': westernFront
    };

    this.layerControl = L.control.layers(
      baseMaps,
      overlayMaps,
    ).addTo(this.leafletMap);

    L.control.opacity(
      overlayMaps, {
        collapsed: true,
        position: 'bottomleft'
      }).addTo(this.leafletMap);

    L.Marker.setBouncingOptions({ exclusive: true });

  }

  componentDidUpdate({ results, mapMode, geoJSONKey, bouncingMarkerKey, openPopupMarkerKey }) {
    if (this.props.bouncingMarker === '' && this.bouncingMarkerObj !== null) {
      this.leafletMap.removeLayer(this.bouncingMarkerObj);
    }

    if (this.props.bouncingMarkerKey !== bouncingMarkerKey) {
      if (this.props.mapMode === 'cluster') {
        const m = this.markers[this.props.bouncingMarker];
        const latlng = m.getLatLng();
        // create a new marker so that the temporary popup can be left open
        this.bouncingMarkerObj = L.marker(latlng);
        this.bouncingMarkerObj.addTo(this.leafletMap).bounce(1);
      } else {
        this.markers[this.props.bouncingMarker].bounce(1);
      }
    }

    if (this.props.openPopupMarkerKey !== openPopupMarkerKey) {
      if (this.props.mapMode === 'cluster') {
        if (this.popupMarkerObj !== null) {
          this.leafletMap.removeLayer(this.popupMarkerObj);
        }
        this.popupMarkerObj = this.markers[this.props.popupMarker];
        this.popupMarkerObj.addTo(this.leafletMap).openPopup();
      } else {
        this.markers[this.props.popupMarker].openPopup();
      }
    }

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
    this.markers = {};
    Object.values(results).forEach(value => {
      const marker = this.createMarker(value);
      this.markers[value.id] = marker;
      marker == null ? null : marker.addTo(this.resultMarkerLayer);
    });
  }

  updateMarkersAndCluster(results) {
    this.resultMarkerLayer.clearLayers();
    this.markers = {};
    const clusterer = new L.MarkerClusterGroup({
      iconCreateFunction: (cluster) => {
        //const childCount = cluster.getChildCount();
        let childCount = 0;
        cluster.getAllChildMarkers().forEach(marker => {
          childCount += parseInt(marker.options.manuscriptCount);
        });
        let c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
      }
    });
    // const clusterer = L.markerClusterGroup();
    Object.values(results).forEach(value => {
      const marker = this.createMarker(value);
      this.markers[value.id] = marker;
      marker == null ? null : clusterer.addLayer(marker);
    });
    clusterer.addTo(this.resultMarkerLayer);
  }

  createMarker(result) {
    // const color = typeof result.markerColor === 'undefined' ? 'grey' : result.markerColor;
    //const icon = new ColorIcon({iconUrl: 'img/markers/marker-icon-' + color + '.png'});
    const { lat, long } = result;
    if (lat === 'Undefined' || long === 'Undefined') {
      return null;
    } else {
      const latLng = [+lat, +long];

      const icon = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: result.manuscriptCount,
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
      });

      const marker = L.marker(latLng, {
        icon: icon,
        manuscriptCount: result.manuscriptCount ? result.manuscriptCount : null,
        manuscript: result.manuscript ? result.manuscript : null
      })
        .bindPopup(this.createPopUpContent(result), { maxHeight: 300, maxWidth: 350, minWidth: 300 });
      return marker;
    }
  }

  createPopUpContent(result) {
    let popUpTemplate = `
      <h3><a target="_blank" rel="noopener noreferrer" href={id}>{label}</a></p></h3>
      `;
    if (result.source) {
      popUpTemplate += '<p>Place authority: <a target="_blank" rel="noopener noreferrer" href={source}>{source}</a></p>';
    }
    popUpTemplate += this.createManscriptListing(result.manuscript);
    return L.Util.template(popUpTemplate, result);
  }

  createManscriptListing(manuscripts) {
    let html = '';
    manuscripts.forEach(msId => {
      const sdbmLink = msId.replace('http://ldf.fi/mmm/manifestation_singleton/', 'https://sdbm.library.upenn.edu/manuscripts/');
      html += '<p><a target="_blank" rel="noopener noreferrer" href=' + sdbmLink + '>' + sdbmLink + '</a></p>';
    });
    return html;
  }

  createOpacitySlider() {
    L.Control.OpacitySlider = L.Control.extend({
      onAdd: function() {
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

    L.control.opacitySlider({ position: 'bottomleft' }).addTo(this.leafletMap);
  }

  render() {
    return <div id="map" style={style} />;
  }
}

LeafletMap.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  results: PropTypes.array,
  mapMode: PropTypes.string.isRequired,
  geoJSON: PropTypes.array,
  geoJSONKey: PropTypes.number.isRequired,
  getGeoJSON: PropTypes.func.isRequired,
  bouncingMarker: PropTypes.string.isRequired,
  popupMarker: PropTypes.string.isRequired,
  bouncingMarkerKey: PropTypes.number.isRequired,
  openPopupMarkerKey: PropTypes.number.isRequired,
};

export default LeafletMap;
