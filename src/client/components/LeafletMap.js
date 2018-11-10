import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { has, orderBy } from 'lodash';
// import LeafletSidebar from './LeafletSidebar';

import 'leaflet-sidebar-v2/js/leaflet-sidebar.min.js';
import 'leaflet-sidebar-v2/css/leaflet-sidebar.min.css';

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
    this.props.fetchPlaces('creationPlaces');

    // Base layers
    const OSMBaseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    const parisTest = L.tileLayer('http://mapwarper.net/maps/tile/28345/{z}/{x}/{y}.png', {
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
      center: [22.43,10.37],
      zoom: 3,
      layers: [
        OSMBaseLayer,
        this.resultMarkerLayer,
      ],
      fullscreenControl: true,
    });

    // layer controls
    // const baseMaps = {
    //   'OpenStreetMap': OSMBaseLayer,
    // };
    const overlayMaps = {
      // 'Search results': this.resultMarkerLayer,
      // 'Karelian maps (MapWarper)': karelianMaps,
      // 'Senate atlas (MapWarper)': senateAtlas,
      'Paris': parisTest
    };

    this.layerControl = L.control.layers(
      //baseMaps,
      overlayMaps,
    ).addTo(this.leafletMap);

    // L.control.opacity(
    //   overlayMaps, {
    //     collapsed: true,
    //     position: 'bottomleft'
    //   }).addTo(this.leafletMap);

    L.Marker.setBouncingOptions({ exclusive: true });

    //L.control.sidebar({ container: 'sidebar' }).addTo(this.leafletMap).open('home');

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
    this.markers = {};
    Object.values(results).forEach(value => {
      const marker = this.createMarker(value);
      this.markers[value.id.replace('http://ldf.fi/mmm/place/', '')] = marker;
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
        let c = ' marker-cluster-large';
        // if (childCount < 10) {
        //   c += 'small';
        // } else if (childCount < 100) {
        //   c += 'medium';
        // } else {
        //   c += 'large';
        // }
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
      }
    });
    results.forEach(value => {
      const marker = this.createMarker(value);
      this.markers[value.id.replace('http://ldf.fi/mmm/place/', '')] = marker;
      marker == null ? null : clusterer.addLayer(marker);
    });
    clusterer.addTo(this.resultMarkerLayer);
  }

  createMarker(result) {
    // const color = typeof result.markerColor === 'undefined' ? 'grey' : result.markerColor;
    //const icon = new ColorIcon({iconUrl: 'img/markers/marker-icon-' + color + '.png'});
    if (!has(result, 'lat') || !has(result, 'long')) {
      return null;
    } else {
      const { lat, long } = result;
      const latLng = [+lat, +long];
      // https://github.com/coryasilva/Leaflet.ExtraMarkers
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
        id: result.id
      })
        .on('click', this.markerOnClick);
      return marker;
    }
  }

  markerOnClick = (event) => {
    const placeId = (event.target.options.id.replace('http://ldf.fi/mmm/place/', ''));
    this.props.fetchPlace(placeId);
  };

  createPopUpContent(result) {
    // console.log(result)
    let popUpTemplate = `<h3><a target="_blank" rel="noopener noreferrer" href=${result.sdbmLink}>${result.prefLabel}</a></p></h3>`;
    if (has(result, 'source')) {
      popUpTemplate += `<p>Place authority: <a target="_blank" rel="noopener noreferrer" href=${result.source}>${result.source}</a></p>`;
    }
    popUpTemplate += `<p>Manuscripts created here:</p>`;
    popUpTemplate += this.createManscriptListing(result.manuscript);
    return popUpTemplate;
  }

  createManscriptListing(manuscripts) {
    let html = '';
    if (Array.isArray(manuscripts)) {
      manuscripts = orderBy(manuscripts, 'id');
      html += '<ul>';
      manuscripts.forEach(ms => {
        let sdbmLink = has(ms, 'manuscriptRecord') ? ms.manuscriptRecord : ms.entry;
        html += '<li><a target="_blank" rel="noopener noreferrer" href=' + sdbmLink + '>' + sdbmLink + '</a></li>';
      });
      html += '</ul>';
    } else {
      let sdbmLink = has(manuscripts, 'manuscriptRecord') ? manuscripts.manuscriptRecord : manuscripts.entry;
      html += '<p><a target="_blank" rel="noopener noreferrer" href=' + sdbmLink + '>' + sdbmLink + '</a></p>';
    }
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
    return (
      <div className="leaflet-outer-container">
        {/*<LeafletSidebar />*/}
        <div id="map" style={style} />
      </div>
    );
  }
}

LeafletMap.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  mapMode: PropTypes.string.isRequired
};

export default LeafletMap;
