import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import L from 'leaflet'
import { has, orderBy } from 'lodash'
import CircularProgress from '@material-ui/core/CircularProgress'
import { purple } from '@material-ui/core/colors'
import { MAPBOX_ACCESS_TOKEN } from '../../configs/sampo/GeneralConfig'
import 'leaflet/dist/leaflet.css' // Official Leaflet styles
import './LeafletMap.css' // Customizations to Leaflet styles

// Leaflet plugins
import 'leaflet-fullscreen/dist/fullscreen.png'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.min.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'Leaflet.Control.Opacity/dist/L.Control.Opacity.css'
import 'Leaflet.Control.Opacity/dist/L.Control.Opacity.js'
import 'Leaflet.extra-markers/dist/js/leaflet.extra-markers.min.js'
import 'Leaflet.extra-markers/dist/css/leaflet.extra-markers.min.css'
import 'Leaflet.extra-markers/dist/img/markers_default.png'
import 'Leaflet.extra-markers/dist/img/markers_shadow.png'
import 'leaflet-draw/dist/leaflet.draw.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.zoominfo/dist/L.Control.Zoominfo'
import 'leaflet.zoominfo/dist/L.Control.Zoominfo.css'
import 'leaflet.heat/dist/leaflet-heat'

import markerShadowIcon from '../../img/markers/marker-shadow.png'
import markerIconViolet from '../../img/markers/marker-icon-violet.png'
import markerIconGreen from '../../img/markers/marker-icon-green.png'
import markerIconRed from '../../img/markers/marker-icon-red.png'
import markerIconOrange from '../../img/markers/marker-icon-orange.png'

const styles = theme => ({
  leafletContainerfacetResults: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    },
    position: 'relative'
  },
  leafletContainerinstancePage: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    position: 'relative'
  },
  mapElement: {
    width: '100%',
    height: '100%'
  },
  spinnerContainer: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 500
  }
})

// https://github.com/pointhi/leaflet-color-markers
const ColorIcon = L.Icon.extend({
  options: {
    shadowUrl: markerShadowIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
})

class LeafletMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeOverlays: [],
      prevZoomLevel: null,
      mapMode: props.mapMode
    }
  }

  componentDidMount = () => {
    if (this.props.pageType === 'facetResults') {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }
    this.initMap()
  }

  componentDidUpdate = (prevProps, prevState) => {
    // check if filters have changed
    if (has(prevProps, 'facetUpdateID') && prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }

    // check if results data or mapMode have changed
    if (prevProps.results !== this.props.results || prevState.mapMode !== this.state.mapMode) {
      this.drawPointData()
    }

    // check if instance have changed
    if ((this.props.instance !== null) && prevProps.instance !== this.props.instance) {
      this.markers[this.props.instance.id]
        .bindPopup(this.createPopUpContent(this.props.instance), {
          maxHeight: 300,
          maxWidth: 400,
          minWidth: 400
        // closeButton: false,
        })
        .openPopup()
    }

    if (this.props.showExternalLayers &&
        (this.props.layers.updateID !== prevProps.layers.updateID)) {
      this.props.layers.layerData.map(layerObj => this.populateOverlay(layerObj))
    }

    if (has(prevProps, 'facet') && prevProps.facet.filterType !== this.props.facet.filterType) {
      if (this.props.facet.filterType === 'spatialFilter') {
        this.addDrawButtons()
      } else {
        this.removeDrawButtons()
      }
    }
  }

  initMap = () => {
    // Base layers
    const mapboxLight = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN, {
      attribution: '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileSize: 512,
      zoomOffset: -1
    })

    // layer for markers
    this.resultMarkerLayer = L.layerGroup()

    // create map
    this.leafletMap = L.map('map', {
      center: [22.43, 10.37],
      zoom: 2,
      zoomControl: false,
      zoominfoControl: true,
      layers: [
        mapboxLight,
        this.resultMarkerLayer
      ],
      fullscreenControl: true
    })

    // initialize layers from external sources
    if (this.props.showExternalLayers) {
      const basemaps = {
        'Mapbox Light': mapboxLight
      }
      this.initOverLays(basemaps)
    }

    // Add scale
    L.control.scale().addTo(this.leafletMap)

    // create layer for bounding boxes
    if (has(this.props, 'facet') && this.props.facet.filterType === 'spatialFilter') {
      this.addDrawButtons()
    }

    if (this.props.showMapModeControl) { this.addMapModeControl() }
  }

  drawPointData = () => {
    const { results } = this.props
    if (this.heatLayer) { this.leafletMap.removeLayer(this.heatLayer) }
    this.resultMarkerLayer.clearLayers()
    switch (this.state.mapMode) {
      case 'cluster':
        this.updateMarkersAndCluster(results)
        break
      case 'marker':
        this.updateMarkers(results)
        break
      case 'heatmap':
        this.drawHeatmap(this.createLatLngArray(results))
        break
      default:
        this.updateMarkersAndCluster(results)
        break
    }
  }

  createLatLngArray = results => {
    return results.map(result => [+result.lat, +result.long])
  }

  initMapEventListeners = () => {
    // Fired when an overlay is selected using layer controls
    this.leafletMap.on('overlayadd', event => {
      const layerID = event.layer.options.id
      // https://www.robinwieruch.de/react-state-array-add-update-remove
      this.setState(state => {
        return {
          activeOverlays: [...state.activeOverlays, layerID]
        }
      })
      if (this.isSafeToLoadLargeLayers()) {
        this.props.fetchGeoJSONLayers({
          layerIDs: this.state.activeOverlays,
          bounds: this.leafletMap.getBounds()
        })
      }
    })
    // Fired when an overlay is selected using layer controls
    this.leafletMap.on('overlayremove', event => {
      const layerIDremoved = event.layer.options.id
      this.clearOverlay(layerIDremoved)
      this.setState(state => {
        const activeOverlays = state.activeOverlays.filter(layerID => layerID !== layerIDremoved)
        return { activeOverlays }
      })
    })
    // Fired when zooming starts
    this.leafletMap.on('zoomstart', () => {
      this.setState({ prevZoomLevel: this.leafletMap.getZoom() })
    })
    // Fired when zooming ends
    this.leafletMap.on('zoomend', () => {
      if (this.state.activeOverlays.length > 0 && this.isSafeToLoadLargeLayersAfterZooming()) {
        this.props.fetchGeoJSONLayers({
          layerIDs: this.state.activeOverlays,
          bounds: this.leafletMap.getBounds()
        })
      }
    })
    // Fired when dragging ends
    this.leafletMap.on('dragend', () => {
      if (this.state.activeOverlays.length > 0 && this.isSafeToLoadLargeLayers()) {
        this.props.fetchGeoJSONLayers({
          layerIDs: this.state.activeOverlays,
          bounds: this.leafletMap.getBounds()
        })
      }
    })
  }

  isSafeToLoadLargeLayersAfterZooming = () => {
    return (this.leafletMap.getZoom() === 13 ||
    (this.leafletMap.getZoom() >= 13 && this.state.prevZoomLevel > this.leafletMap.getZoom()))
  }

  isSafeToLoadLargeLayers = () => this.leafletMap.getZoom() >= 13

  initOverLays = basemaps => {
    const fhaArchaeologicalSiteRegistryAreas = L.layerGroup([], {
      id: 'arkeologiset_kohteet_alue',
      // this layer includes only GeoJSON Polygons, define style for them
      geojsonMPolygonOptions: {
        color: '#dd2c00',
        cursor: 'pointer',
        dashArray: '3, 5'
      }
    })
    const fhaArchaeologicalSiteRegistryPoints = L.layerGroup([], {
      id: 'arkeologiset_kohteet_piste',
      // this layer includes only GeoJSON points, define style for them
      geojsonMarkerOptions: {
        radius: 8,
        fillColor: '#dd2c00',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    })
    this.overlayLayers = {
      [intl.get('leafletMap.externalLayers.arkeologiset_kohteet_alue')]: fhaArchaeologicalSiteRegistryAreas,
      [intl.get('leafletMap.externalLayers.arkeologiset_kohteet_piste')]: fhaArchaeologicalSiteRegistryPoints
    }
    L.control.layers(basemaps, this.overlayLayers).addTo(this.leafletMap)
    this.initMapEventListeners()
  }

  populateOverlay = layerObj => {
    /*
      The baseLayers and overlays parameters are object literals with layer names as keys
      and Layer objects as values
    */
    const leafletOverlay = this.overlayLayers[intl.get(`leafletMap.externalLayers.${layerObj.layerID}`)]
    const leafletGeoJSONLayer = L.geoJSON(layerObj.geoJSON, {
      // style for GeoJSON Points
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, leafletOverlay.options.geojsonMarkerOptions)
      },
      // style for GeoJSON Polygons
      style: leafletOverlay.options.geojsonMPolygonOptions,
      // add popups
      onEachFeature: (feature, layer) => {
        layer.bindPopup(this.createPopUpContentGeoJSON(feature.properties))
      }
    })
    leafletGeoJSONLayer.addTo(leafletOverlay).addTo(this.leafletMap)
  }

  clearOverlay = id => {
    const leafletOverlay = this.overlayLayers[intl.get(`leafletMap.externalLayers.${id}`)]
    leafletOverlay.clearLayers()
  }

  addMapModeControl = () => {
    L.Control.Heatmap = L.Control.extend({
      onAdd: map => {
        const container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded')
        const markersInputContainer = L.DomUtil.create('div', 'leaflet-control-mapmode-input-container', container)
        const heatmapInputContainer = L.DomUtil.create('div', 'leaflet-control-mapmode-input-container', container)
        const radioMarkers = L.DomUtil.create('input', 'leaflet-control-mapmode-input', markersInputContainer)
        const radioHeatmap = L.DomUtil.create('input', 'leaflet-control-mapmode-input', heatmapInputContainer)
        const markersLabel = L.DomUtil.create('label', 'leaflet-control-mapmode-label', markersInputContainer)
        const heatmapLabel = L.DomUtil.create('label', 'leaflet-control-mapmode-label', heatmapInputContainer)
        radioMarkers.id = 'leaflet-control-mapmode-markers'
        radioHeatmap.id = 'leaflet-control-mapmode-heatmap'
        radioMarkers.type = 'radio'
        radioHeatmap.type = 'radio'
        radioMarkers.checked = this.state.mapMode === 'cluster'
        radioHeatmap.checked = this.state.mapMode === 'heatmap'
        radioMarkers.name = 'mapmode'
        radioHeatmap.name = 'mapmode'
        radioMarkers.value = 'cluster'
        radioHeatmap.value = 'heatmap'
        markersLabel.for = 'leaflet-control-mapmode-markers'
        markersLabel.textContent = 'Markers'
        heatmapLabel.for = 'leaflet-control-mapmode-heatmap'
        heatmapLabel.textContent = 'Heatmap'
        L.DomEvent.on(radioMarkers, 'click', event => this.setState({ mapMode: event.target.value }))
        L.DomEvent.on(radioHeatmap, 'click', event => this.setState({ mapMode: event.target.value }))
        return container
      },
      onRemove: map => {
        // Nothing to do here
      }
    })
    L.control.heatmap = opts => {
      return new L.Control.Heatmap(opts)
    }
    L.control.heatmap({ position: 'topleft' }).addTo(this.leafletMap)
  }

  addDrawButtons = () => {
    this.drawnItems = new L.FeatureGroup()
    this.leafletMap.addLayer(this.drawnItems)

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
        featureGroup: this.drawnItems
      }
    })

    this.drawControlEditOnly = new L.Control.Draw({
      draw: false,
      edit: {
        featureGroup: this.drawnItems
      }
    })

    if (this.props.facet.spatialFilter !== null) {
      this.drawnItems.addLayer(this.props.facet.spatialFilter)
      this.leafletMap.addControl(this.drawControlEditOnly)
    } else {
      this.leafletMap.addControl(this.drawControlFull)
    }

    this.leafletMap.on(L.Draw.Event.CREATED, e => {
      this.drawnItems.addLayer(e.layer)
      this.leafletMap.removeControl(this.drawControlFull)
      this.leafletMap.addControl(this.drawControlEditOnly)
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'spatialFilter',
        value: e.layer
      })
    })

    this.leafletMap.on(L.Draw.Event.EDITED, e => {
      e.layers.eachLayer(layer => {
        this.props.updateFacetOption({
          facetClass: this.props.facetClass,
          facetID: this.props.facetID,
          option: 'spatialFilter',
          value: layer
        })
      })
    })

    this.leafletMap.on(L.Draw.Event.DELETED, () => {
      this.leafletMap.removeControl(this.drawControlEditOnly)
      this.leafletMap.addControl(this.drawControlFull)
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'spatialFilter',
        value: null
      })
    })
  }

  removeDrawButtons = () => {
    this.leafletMap.removeLayer(this.drawnItems)
    this.leafletMap.removeControl(this.drawControlFull)
    this.leafletMap.removeControl(this.drawControlEditOnly)
  }

  drawHeatmap = latLngs => {
    this.heatLayer = L.heatLayer(latLngs, {
      radius: 15,
      minOpacity: 1.0,
      blur: 25,
      maxZoom: 13,
      // Google maps gradient settings is used as default
      gradient: {
        0: '#66ff00',
        0.1: '#66ff00',
        0.2: '#93ff00',
        0.3: '#c1ff00',
        0.4: '#eeff00',
        0.5: '#f4e300',
        0.6: '#f9c600',
        0.7: '#ffaa00',
        0.8: '#ff7100',
        0.9: '#ff3900',
        1: '#ff0000'
      }
    })
    this.leafletMap.addLayer(this.heatLayer)
  }

  updateMarkers = results => {
    this.resultMarkerLayer.clearLayers()
    this.markers = {}
    Object.values(results).forEach(value => {
      const marker = this.createMarker(value)
      if (marker !== null) {
        this.markers[value.id] = marker
        marker.addTo(this.resultMarkerLayer)
      }
    })
  }

  updateMarkersAndCluster = results => {
    this.resultMarkerLayer.clearLayers()
    this.markers = {}
    let clusterer = null
    clusterer = new L.MarkerClusterGroup({
      iconCreateFunction: (cluster) => {
        let childCount = 0
        if (this.props.showInstanceCountInClusters) {
          cluster.getAllChildMarkers().forEach(marker => {
            childCount += parseInt(marker.options.instanceCount)
          })
        } else {
          childCount = cluster.getChildCount()
        }
        let c = ' marker-cluster-'
        if (childCount < 10) {
          c += 'small'
        } else if (childCount < 100) {
          c += 'medium'
        } else {
          c += 'large'
        }
        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(40, 40)
        })
      }
    })
    for (const result of results) {
      const marker = this.createMarker(result)
      if (marker !== null) {
        this.markers[result.id] = marker
        clusterer.addLayer(marker)
      }
    }
    clusterer.addTo(this.resultMarkerLayer)
  }

  createMarker = result => {
    if (!has(result, 'lat') ||
        !has(result, 'long') ||
        result.lat === 'Undefined' ||
        result.long === 'Undefined'
    ) {
      return null
    } else {
      const lat = Array.isArray(result.lat) ? result.lat[0] : result.lat
      const long = Array.isArray(result.long) ? result.long[0] : result.long
      const latLng = [+lat, +long]
      let marker = null

      if (this.props.showInstanceCountInClusters) {
        // https://github.com/coryasilva/Leaflet.ExtraMarkers
        const icon = L.ExtraMarkers.icon({
          icon: 'fa-number',
          number: result.instanceCount,
          markerColor: 'blue',
          shape: 'circle',
          prefix: 'fa'
        })
        marker = L.marker(latLng, {
          icon: icon,
          instanceCount: result.instanceCount ? result.instanceCount : null,
          id: result.id,
          prefLabel: result.prefLabel ? result.prefLabel : null,
          events: result.events ? result.events : null
        })
      } else {
        const color = 'green'
        let markerIcon = ''
        switch (color) {
          case 'violet':
            markerIcon = markerIconViolet
            break
          case 'green':
            markerIcon = markerIconGreen
            break
          case 'red':
            markerIcon = markerIconRed
            break
          case 'orange':
            markerIcon = markerIconOrange
            break
        }
        marker = L.marker(latLng, {
          icon: new ColorIcon({ iconUrl: markerIcon }),
          id: result.id,
          prefLabel: result.prefLabel ? result.prefLabel : null,
          events: result.events ? result.events : null
        })
      }
      if (this.props.pageType === 'facetResults') {
        marker.on('click', this.markerOnClickFacetResults)
      }
      if (this.props.pageType === 'instancePage') {
        marker.bindPopup(this.createPopUpContent(marker.options))
      }
      return marker
    }
  }

  markerOnClickFacetResults = event => {
    this.props.fetchByURI({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      uri: event.target.options.id
    })
  };

  // TODO: add click events instead of a tags:
  // https://stackoverflow.com/questions/54744762/click-event-on-leaflet-popup-content
  createPopUpContent = result => {
    let popUpTemplate = ''
    if (Array.isArray(result.prefLabel)) {
      result.prefLabel = result.prefLabel[0]
    }
    if (has(result.prefLabel, 'dataProviderUrl')) {
      popUpTemplate += `<a href=${result.prefLabel.dataProviderUrl}><h3>${result.prefLabel.prefLabel}</h3></a>`
    } else {
      popUpTemplate += `<h3>${result.prefLabel.prefLabel}</h3>`
    }
    if (has(result, 'sameAs')) {
      popUpTemplate += `<p>Place authority: <a target="_blank" rel="noopener noreferrer" href=${result.sameAs}>${result.sameAs}</a></p>`
    }
    if (this.props.resultClass === 'placesMsProduced') {
      popUpTemplate += '<p>Manuscripts produced here:</p>'
      popUpTemplate += this.createInstanceListing(result.related)
    }
    if (this.props.resultClass === 'lastKnownLocations') {
      popUpTemplate += '<p>Last known location of:</p>'
      popUpTemplate += this.createInstanceListing(result.related)
    }
    if (this.props.resultClass === 'placesActors') {
      popUpTemplate += '<p>Actors:</p>'
      popUpTemplate += this.createInstanceListing(result.related)
    }
    if (this.props.resultClass === 'instanceEvents') {
      popUpTemplate += '<p>Events:</p>'
      popUpTemplate += this.createInstanceListing(result.events)
    }
    // console.log(popUpTemplate)
    return popUpTemplate
  }

  createPopUpContentGeoJSON = properties => {
    let popupText = ''
    const name = properties.kohdenimi
      ? `<b>Kohteen nimi:</b> ${properties.kohdenimi}</p>` : ''
    const type = properties.laji ? `<b>Kohteen tyyppi:</b> ${properties.laji}</p>` : ''
    const municipality = properties.kunta ? `<b>Kunta:</b> ${properties.kunta}</p>` : ''
    const link = properties.mjtunnus
      ? `<a href="https://www.kyppi.fi/to.aspx?id=112.${properties.mjtunnus}" target="_blank">Avaa kohde Muinaisjäännösrekisterissä</a></p>` : ''
    popupText += `
      <div>
        ${name}
        ${type}
        ${municipality}
        ${link}
      </div>
      `
    return popupText
  }

  createInstanceListing = instances => {
    let html = ''
    if (Array.isArray(instances)) {
      instances = orderBy(instances, 'prefLabel')
      html += '<ul>'
      instances.forEach(i => {
        html += '<li><a href=' + i.dataProviderUrl + '>' + i.prefLabel + '</a></li>'
      })
      html += '</ul>'
    } else {
      html += '<p><a href=' + instances.dataProviderUrl + '>' + instances.prefLabel + '</a></p>'
    }
    return html
  }

  createOpacitySlider = () => {
    L.Control.OpacitySlider = L.Control.extend({
      onAdd: function () {
        const slider = L.DomUtil.create('input', 'opacity-slider')
        slider.type = 'range'
        slider.min = 0
        slider.max = 100
        slider.value = 100
        return slider
      }
    })

    L.control.opacitySlider = function (opts) {
      return new L.Control.OpacitySlider(opts)
    }

    L.control.opacitySlider({ position: 'bottomleft' }).addTo(this.leafletMap)
  }

  render = () => {
    return (
      <>
        <div className={this.props.classes[`leafletContainer${this.props.pageType}`]}>
          <div id='map' className={this.props.classes.mapElement} />
          {(this.props.fetching ||
            (this.props.showExternalLayers && this.props.layers.fetching)) &&
              <div className={this.props.classes.spinnerContainer}>
                <CircularProgress style={{ color: purple[500] }} thickness={5} />
              </div>}
        </div>
      </>
    )
  }
}

LeafletMap.propTypes = {
  classes: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  layers: PropTypes.object,
  facetID: PropTypes.string,
  facet: PropTypes.object,
  instance: PropTypes.object,
  facetUpdateID: PropTypes.number,
  fetchResults: PropTypes.func,
  fetchGeoJSONLayers: PropTypes.func,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  fetchByURI: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  mapMode: PropTypes.string.isRequired,
  showInstanceCountInClusters: PropTypes.bool,
  showExternalLayers: PropTypes.bool,
  updateFacetOption: PropTypes.func
}

export default withStyles(styles)(LeafletMap)
