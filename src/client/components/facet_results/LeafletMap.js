import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import L from 'leaflet';
import { has, orderBy } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import { purple } from '@material-ui/core/colors';

import 'leaflet/dist/leaflet.css';

// Leaflet plugins
import 'leaflet-fullscreen/dist/fullscreen.png';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.min.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'Leaflet.Control.Opacity/dist/L.Control.Opacity.css';
import 'Leaflet.Control.Opacity/dist/L.Control.Opacity.js';
import 'Leaflet.extra-markers/dist/js/leaflet.extra-markers.min.js';
import 'Leaflet.extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'Leaflet.extra-markers/dist/img/markers_default.png';
import 'Leaflet.extra-markers/dist/img/markers_shadow.png';
import 'leaflet-draw/dist/leaflet.draw.js';
import 'leaflet-draw/dist/leaflet.draw.css';

import markerShadowIcon from '../../img/markers/marker-shadow.png';
import markerIconViolet from '../../img/markers/marker-icon-violet.png';
import markerIconGreen from '../../img/markers/marker-icon-green.png';
import markerIconRed from '../../img/markers/marker-icon-red.png';
import markerIconOrange from '../../img/markers/marker-icon-orange.png';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWtrb25lbiIsImEiOiJjam5vampzZ28xd2dyM3BzNXR0Zzg4azl4In0.eozyF-bBaZbA3ibhvJlJpQ';

const style = {
  width: '100%',
  height: '100%'
};

const styles = theme => ({
  leafletContainer: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    }
  },
  spinner: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 500
  },
});

//https://github.com/pointhi/leaflet-color-markers
const ColorIcon = L.Icon.extend({
  options: {
    shadowUrl: markerShadowIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
});

class LeafletMap extends React.Component {

  componentDidMount = () => {
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      sortBy: null,
      variant: this.props.variant,
    });

    // Base layers
    // const OSMBaseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // });

    const mapboxLight = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN, {
      attribution: '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileSize: 512,
      zoomOffset: -1
    });

    // const parisTest = L.tileLayer('http://mapwarper.net/maps/tile/28345/{z}/{x}/{y}.png', {
    //   attribution: 'SeCo'
    // });



    // create marker layers
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
      zoom: 2,
      layers: [
        //OSMBaseLayer,
        mapboxLight,
        this.resultMarkerLayer,
      ],
      fullscreenControl: true,
    });

    // create layer for bounding boxes
    if (has(this.props, 'facet') && this.props.facet.filterType === 'spatialFilter') {
      this.addDrawButtons();
    }

    // layer controls
    // const baseMaps = {
    //   'OpenStreetMap': OSMBaseLayer,
    // };
    // const overlayMaps = {
    //   // 'Search results': this.resultMarkerLayer,
    //   // 'Karelian maps (MapWarper)': karelianMaps,
    //   // 'Senate atlas (MapWarper)': senateAtlas,
    //   'Paris': parisTest
    // };

    // this.layerControl = L.control.layers(
    //   //baseMaps,
    //   overlayMaps,
    // ).addTo(this.leafletMap);

    // L.control.opacity(
    //   overlayMaps, {
    //     collapsed: true,
    //     position: 'bottomleft'
    //   }).addTo(this.leafletMap);

    // L.Marker.setBouncingOptions({ exclusive: true });

    //L.control.sidebar({ container: 'sidebar' }).addTo(this.leafletMap).open('home');
  }

  componentDidUpdate = prevProps => {
    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null,
        variant: this.props.variant,
      });
    }

    // check if results data or mapMode have changed
    if (prevProps.results !== this.props.results || prevProps.mapMode !== this.props.mapMode) {
      if (this.props.mapMode === 'cluster') {
        this.updateMarkersAndCluster(this.props.results);
      } else {
        this.updateMarkers(this.props.results);
      }
    }

    // check if instance have changed
    if (prevProps.instance !== this.props.instance) {
      this.markers[this.props.instance.id]
        .bindPopup(this.createPopUpContent(this.props.instance), {
          maxHeight: 300,
          maxWidth: 400,
          minWidth: 400,
        //closeButton: false,
        })
        .openPopup();
    }

    if (has(prevProps, 'facet') && prevProps.facet.filterType !== this.props.facet.filterType) {
      if (this.props.facet.filterType === 'spatialFilter') {
        this.addDrawButtons();
      } else {
        this.removeDrawButtons();
      }
    }
  }

  addDrawButtons = () => {
    this.drawnItems = new L.FeatureGroup();
    this.leafletMap.addLayer(this.drawnItems);

    // https://github.com/Leaflet/Leaflet.draw/issues/315
    this.drawControlFull = new L.Control.Draw({
      draw: {
        polyline: false,
        rectangle: {
          shapeOptions: {
            color: '#bada55'
          }
        },
        circle: false,
        polygon: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawnItems,
      }});

    this.drawControlEditOnly = new L.Control.Draw({
      draw: false,
      edit: {
        featureGroup: this.drawnItems
      },
    });

    if (this.props.facet.spatialFilter !== null) {
      this.drawnItems.addLayer(this.props.facet.spatialFilter);
      this.leafletMap.addControl(this.drawControlEditOnly);
    } else {
      this.leafletMap.addControl(this.drawControlFull);
    }

    this.leafletMap.on(L.Draw.Event.CREATED, e => {
      this.drawnItems.addLayer(e.layer);
      this.leafletMap.removeControl(this.drawControlFull);
      this.leafletMap.addControl(this.drawControlEditOnly);
      //console.log(e.layer)
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'spatialFilter',
        value: e.layer
      });
    });

    this.leafletMap.on(L.Draw.Event.EDITED, e => {
      e.layers.eachLayer(layer => {
        this.props.updateFacetOption({
          facetClass: this.props.facetClass,
          facetID: this.props.facetID,
          option: 'spatialFilter',
          value: layer
        });
      });
    });

    this.leafletMap.on(L.Draw.Event.DELETED, () => {
      this.leafletMap.removeControl(this.drawControlEditOnly);
      this.leafletMap.addControl(this.drawControlFull);
      //console.log(e.layer)
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'spatialFilter',
        value: null
      });
    });
  }

  removeDrawButtons = () => {
    this.leafletMap.removeLayer(this.drawnItems);
    this.leafletMap.removeControl(this.drawControlFull);
    this.leafletMap.removeControl(this.drawControlEditOnly);
  }

  renderSpinner = () => {
    if(this.props.fetching) {
      return (
        <div className={this.props.classes.spinner}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      );
    }
    return null;
  }


  updateMarkers = results => {
    this.resultMarkerLayer.clearLayers();
    this.markers = {};
    Object.values(results).forEach(value => {
      const marker = this.createMarker(value);
      this.markers[value.id] = marker;
      marker == null ? null : marker.addTo(this.resultMarkerLayer);
    });
  }

  updateMarkersAndCluster = results => {
    //console.log(results)
    this.resultMarkerLayer.clearLayers();
    this.markers = {};
    let clusterer = null;
    clusterer = new L.MarkerClusterGroup({
      iconCreateFunction: (cluster) => {
        let childCount = 0;
        if (this.props.showInstanceCountInClusters) {
          cluster.getAllChildMarkers().forEach(marker => {
            childCount += parseInt(marker.options.instanceCount);
          });
        } else {
          childCount = cluster.getChildCount();
        }
        let c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
        //return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster marker-cluster-grey', iconSize: new L.Point(40, 40) });
      }
    });
    for (const result of results) {
      const marker = this.createMarker(result);
      if (marker !== null) {
        this.markers[result.id] = marker;
        clusterer.addLayer(marker);
      }
    }
    clusterer.addTo(this.resultMarkerLayer);
  }

  createMarker = result => {
    // const color = typeof result.markerColor === 'undefined' ? 'grey' : result.markerColor;
    // const icon = new ColorIcon({iconUrl: 'img/markers/marker-icon-' + color + '.png'});
    if (!has(result, 'lat')
        || !has(result, 'long')
        || result.lat === 'Undefined'
        || result.long === 'Undefined'
    ) {
      return null;
    }
    else {
      const lat = Array.isArray(result.lat) ? result.lat[0] : result.lat;
      const long = Array.isArray(result.long) ? result.long[0] : result.long;
      const latLng = [+lat, +long];
      let marker = null;

      if (this.props.showInstanceCountInClusters) {
        // https://github.com/coryasilva/Leaflet.ExtraMarkers
        const icon = L.ExtraMarkers.icon({
          icon: 'fa-number',
          number: result.instanceCount,
          markerColor: 'blue',
          shape: 'circle',
          prefix: 'fa'
        });
        marker = L.marker(latLng, {
          icon: icon,
          instanceCount: result.instanceCount ? result.instanceCount : null,
          id: result.id
        })
          .on('click', this.markerOnClick);
      } else {

        const color = 'green';

        let markerIcon = '';
        switch(color) {
          case 'violet':
            markerIcon = markerIconViolet;
            break;
          case 'green':
            markerIcon = markerIconGreen;
            break;
          case 'red':
            markerIcon = markerIconRed;
            break;
          case 'orange':
            markerIcon = markerIconOrange;
            break;
        }

        marker = L.marker(latLng, {
          icon: new ColorIcon({iconUrl: markerIcon }),
          id: result.id
        })
          .on('click', this.markerOnClick);
      }

      return marker;
    }
  }

  markerOnClick = event => {
    this.props.fetchByURI({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      variant: this.props.variant,
      uri: event.target.options.id
    });
  };

  createPopUpContent = result => {
    let popUpTemplate = '';
    if (has(result.prefLabel, 'dataProviderUrl')) {
      popUpTemplate += `<a href=${result.prefLabel.dataProviderUrl}><h3>${result.prefLabel.prefLabel}</h3></a>`;
    } else {
      popUpTemplate += `<h3>${result.prefLabel.prefLabel}</h3>`;
    }
    if (has(result, 'sameAs')) {
      popUpTemplate += `<p>Place authority: <a target="_blank" rel="noopener noreferrer" href=${result.sameAs}>${result.sameAs}</a></p>`;
    }
    if (this.props.variant === 'productionPlaces') {
      popUpTemplate += `<p>Manuscripts produced here:</p>`;
      popUpTemplate += this.createInstanceListing(result.related);
    }
    if (this.props.variant === 'actorPlaces') {
      popUpTemplate += `<p>Actors:</p>`;
      popUpTemplate += this.createInstanceListing(result.related);
    }

    return popUpTemplate;
  }

  createInstanceListing = instances => {
    let html = '';
    if (Array.isArray(instances)) {
      instances = orderBy(instances, 'prefLabel');
      html += '<ul>';
      instances.forEach(i => {
        html += '<li><a target="_blank" rel="noopener noreferrer" href=' + i.dataProviderUrl + '>' + i.prefLabel + '</a></li>';
      });
      html += '</ul>';
    } else {
      html += '<p><a target="_blank" rel="noopener noreferrer" href=' + instances.dataProviderUrl + '>' + instances.prefLabel + '</a></p>';
    }
    return html;
  }

  createOpacitySlider = () => {
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

  render = () => {
    return (
      <React.Fragment>
        <div className={this.props.classes.leafletContainer}>
          {/*<LeafletSidebar />*/}
          <div id="map" style={style} />
        </div>
        {this.renderSpinner()}
      </React.Fragment>
    );
  }
}

LeafletMap.propTypes = {
  classes: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  facetID: PropTypes.string,
  facet: PropTypes.object,
  instance: PropTypes.object,
  facetUpdateID: PropTypes.number,
  fetchResults: PropTypes.func,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  fetchByURI: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  mapMode: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  showInstanceCountInClusters: PropTypes.bool,
  updateFacetOption: PropTypes.func,
};

export default withStyles(styles)(LeafletMap);
