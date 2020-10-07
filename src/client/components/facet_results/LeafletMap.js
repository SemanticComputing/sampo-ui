import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import L from 'leaflet'
import { has, orderBy, isEqual } from 'lodash'
import CircularProgress from '@material-ui/core/CircularProgress'
import { purple } from '@material-ui/core/colors'
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../../configs/sampo/GeneralConfig'
// import { apiUrl } from '../../epics'
import 'leaflet/dist/leaflet.css' // Official Leaflet styles
import './LeafletMap.css' // Customizations to Leaflet styles

// Leaflet plugins
import 'leaflet-fullscreen/dist/fullscreen.png'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.min.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.control.opacity/dist/L.Control.Opacity.css'
import 'leaflet.control.opacity'
import 'Leaflet.extra-markers/dist/js/leaflet.extra-markers.min.js'
import 'Leaflet.extra-markers/dist/css/leaflet.extra-markers.min.css'
import 'Leaflet.extra-markers/dist/img/markers_default.png'
import 'Leaflet.extra-markers/dist/img/markers_shadow.png'
import 'leaflet-draw/dist/leaflet.draw.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.zoominfo/dist/L.Control.Zoominfo'
import 'leaflet.zoominfo/dist/L.Control.Zoominfo.css'
// import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js'

import markerShadowIcon from '../../img/markers/marker-shadow.png'
import markerIconViolet from '../../img/markers/marker-icon-violet.png'
import markerIconGreen from '../../img/markers/marker-icon-green.png'
import markerIconRed from '../../img/markers/marker-icon-red.png'
import markerIconOrange from '../../img/markers/marker-icon-orange.png'
import markerIconYellow from '../../img/markers/marker-icon-yellow.png'

const styles = theme => ({
  leafletContainerfacetResults: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    },
    position: 'relative'
  },
  leafletContainerclientFSResults: {
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

/**
 * A component for a Leaflet map with optional functionalities for clustering of markers,
 * switchable basemaps and overlay layers.
 */
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
    if (this.props.mapMode &&
      (this.props.pageType === 'facetResults' || this.props.pageType === 'instancePage')) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null,
        uri: this.props.uri
      })
    }
    this.initMap()
    if (this.props.mapMode && this.props.pageType === 'clientFSResults') {
      this.drawPointData()
    }
    if (this.props.showExternalLayers) {
      this.props.clearGeoJSONLayers()
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.props.facetedSearchMode === 'clientFS'
      ? this.clientFScomponentDidUpdate(prevProps) : this.serverFScomponentDidUpdate(prevProps, prevState)
  }

  componentWillUnmount = () => {
    if (!this.leafletMap == null) {
      this.leafletMap.remove()
    }
  }

  clientFScomponentDidUpdate = prevProps => {
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.drawPointData()
    }
    if (this.props.showExternalLayers &&
      (this.props.layers.updateID !== prevProps.layers.updateID)) {
      this.props.layers.layerData.map(layerObj => this.populateOverlay(layerObj))
    }
  }

  serverFScomponentDidUpdate = (prevProps, prevState) => {
    // check if filters have changed
    if (has(prevProps, 'facetUpdateID') && prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }

    // check if results data have changed
    if (prevProps.results !== this.props.results) {
      this.drawPointData()
    }

    // check if map mode has changed
    if (prevState.mapMode !== this.state.mapMode) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }

    // check if instance have changed
    if ((this.props.instance !== null) && !isEqual(prevProps.instance, this.props.instance)) {
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
    // Base layer(s)
    const mapboxBaseLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`, {
      attribution: '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileSize: 512,
      zoomOffset: -1
    })

    /*
      Password protected base layers from https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts
      Routed via backend.
    */
    // const backgroundMapNLS = L.tileLayer(`${apiUrl}/nls-wmts?z={z}&x={x}&y={y}&layerID=taustakartta`, {
    //   attribution: 'National Land Survey of Finland',
    //   maxZoom: 18
    // })
    // const topographicalMapNLS = L.tileLayer(`${apiUrl}/nls-wmts?z={z}&x={x}&y={y}&layerID=maastokartta`, {
    //   attribution: 'National Land Survey of Finland',
    //   maxZoom: 18
    // })
    // const googleRoadmap = L.gridLayer.googleMutant({
    //   type: 'roadmap'
    // })

    // layer for markers
    this.resultMarkerLayer = L.layerGroup()

    const container = this.props.container ? this.props.container : 'map'

    this.leafletMap = L.map(container, {
      center: this.props.center,
      zoom: this.props.zoom,
      zoomControl: false,
      zoominfoControl: true,
      layers: [
        mapboxBaseLayer,
        this.resultMarkerLayer
      ],
      fullscreenControl: true
    })

    // initialize layers from external sources
    if (this.props.showExternalLayers) {
      const basemaps = {
        [intl.get(`leafletMap.basemaps.mapbox.${MAPBOX_STYLE}`)]: mapboxBaseLayer
        // [intl.get('leafletMap.basemaps.backgroundMapNLS')]: backgroundMapNLS,
        // [intl.get('leafletMap.basemaps.topographicalMapNLS')]: topographicalMapNLS
        // [intl.get('leafletMap.basemaps.googleRoadmap')]: googleRoadmap,
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
    if (this.props.updateMapBounds) {
      this.props.updateMapBounds(this.boundsToValues())
      this.leafletMap.on('moveend', () => {
        this.props.updateMapBounds(this.boundsToValues())
      })
    }
  }

  boundsToValues = () => {
    const bounds = this.leafletMap.getBounds()
    const latMin = bounds._southWest.lat
    const longMin = bounds._southWest.lng
    const latMax = bounds._northEast.lat
    const longMax = bounds._northEast.lng
    return {
      latMin: latMin,
      longMin: longMin,
      latMax: latMax,
      longMax: longMax,
      zoom: this.leafletMap.getZoom()
    }
  }

  drawPointData = () => {
    const { results } = this.props
    this.resultMarkerLayer.clearLayers()
    switch (this.state.mapMode) {
      case 'cluster':
        this.updateMarkersAndCluster(results)
        break
      case 'marker':
        this.updateMarkers(results)
        break
      // case 'heatmap':
      //   this.drawHeatmap(this.createLatLngArray(results))
      //   break
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
      if (event.layer.options.type === 'geoJSON') {
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
        } else {
          this.props.showError({
            title: '',
            text: intl.get('leafletMap.wrongZoomLevelFHA')
          })
        }
      }
    })
    // Fired when an overlay is selected using layer controls
    this.leafletMap.on('overlayremove', event => {
      if (event.layer.options.type === 'geoJSON') {
        const layerIDremoved = event.layer.options.id
        this.clearOverlay(layerIDremoved)
        this.setState(state => {
          const activeOverlays = state.activeOverlays.filter(layerID => layerID !== layerIDremoved)
          return { activeOverlays }
        })
      }
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

  isSafeToLoadLargeLayersAfterZooming = () => true
  // {
  //   return (this.leafletMap.getZoom() === 13 ||
  //     (this.leafletMap.getZoom() >= 13 && this.state.prevZoomLevel > this.leafletMap.getZoom()))
  // }

  isSafeToLoadLargeLayers = () => true
  // this.leafletMap.getZoom() >= 13

  initOverLays = basemaps => {
    // const fhaArchaeologicalSiteRegistryAreas = L.layerGroup([], {
    //   id: 'arkeologiset_kohteet_alue',
    //   type: 'geoJSON',
    //   source: 'FHA',
    //   // this layer includes only GeoJSON Polygons, define style for them
    //   geojsonMPolygonOptions: {
    //     color: '#dd2c00',
    //     cursor: 'pointer',
    //     dashArray: '3, 5'
    //   }
    // })
    // const fhaArchaeologicalSiteRegistryPoints = L.layerGroup([], {
    //   id: 'arkeologiset_kohteet_piste',
    //   type: 'geoJSON',
    //   source: 'FHA',
    //   // this layer includes only GeoJSON points, define style for them
    //   geojsonMarkerOptions: {
    //     radius: 8,
    //     fillColor: '#dd2c00',
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    //   }
    // })
    const kotusParishes1938 = L.layerGroup([], {
      id: 'kotus:pitajat',
      type: 'geoJSON',
      source: 'kotus',
      // this layer includes only GeoJSON Polygons, define style for them
      geojsonMPolygonOptions: {
        color: '#dd2c00',
        cursor: 'pointer',
        dashArray: '3, 5'
      }
    })
    const kotusParishesDialecticalRegions = L.layerGroup([], {
      id: 'kotus:rajat-sms-alueet',
      type: 'geoJSON',
      source: 'kotus',
      // this layer includes only GeoJSON Polygons, define style for them
      geojsonMPolygonOptions: {
        color: '#fca903',
        cursor: 'pointer',
        dashArray: '3, 5'
      }
    })
    const kotusParishesDialecticalSubRegions = L.layerGroup([], {
      id: 'kotus:rajat-sms-alueosat',
      type: 'geoJSON',
      source: 'kotus',
      // this layer includes only GeoJSON Polygons, define style for them
      geojsonMPolygonOptions: {
        color: '#119100',
        cursor: 'pointer',
        dashArray: '3, 5'
      }
    })
    const kotusParishesDialecticalBorder = L.layerGroup([], {
      id: 'kotus:rajat-lansi-ita',
      type: 'geoJSON',
      source: 'kotus',
      // this layer includes only GeoJSON Polygons, define style for them
      geojsonMPolygonOptions: {
        color: '#2403fc',
        cursor: 'pointer',
        dashArray: '3, 5'
      }
    })
    const karelianMaps = L.tileLayer('https:///mapwarper.onki.fi/mosaics/tile/4/{z}/{x}/{y}.png', {
      type: 'tile',
      attribution: 'SeCo'
    })
    const senateAtlas = L.tileLayer('https:///mapwarper.onki.fi/mosaics/tile/5/{z}/{x}/{y}.png', {
      type: 'tile',
      attribution: 'SeCo'
    })
    this.overlayLayers = {
      // [intl.get('leafletMap.externalLayers.arkeologiset_kohteet_alue')]: fhaArchaeologicalSiteRegistryAreas,
      // [intl.get('leafletMap.externalLayers.arkeologiset_kohteet_piste')]: fhaArchaeologicalSiteRegistryPoints,
      [intl.get('leafletMap.externalLayers.karelianMaps')]: karelianMaps,
      [intl.get('leafletMap.externalLayers.senateAtlas')]: senateAtlas,
      [intl.get('leafletMap.externalLayers.kotus:pitajat')]: kotusParishes1938,
      [intl.get('leafletMap.externalLayers.kotus:rajat-sms-alueet')]: kotusParishesDialecticalRegions,
      [intl.get('leafletMap.externalLayers.kotus:rajat-sms-alueosat')]: kotusParishesDialecticalSubRegions,
      [intl.get('leafletMap.externalLayers.kotus:rajat-lansi-ita')]: kotusParishesDialecticalBorder
    }
    L.control.layers(basemaps, this.overlayLayers).addTo(this.leafletMap)
    const opacityLayers = {
      [intl.get('leafletMap.externalLayers.karelianMaps')]: karelianMaps,
      [intl.get('leafletMap.externalLayers.senateAtlas')]: senateAtlas
    }
    this.createOpacitySlider(opacityLayers)
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
        layer.bindPopup(this.createPopUpContentGeoJSON(layerObj.layerID, feature.properties))
      }
    })
    leafletGeoJSONLayer.addTo(leafletOverlay).addTo(this.leafletMap)
  }

  clearOverlay = id => {
    const leafletOverlay = this.overlayLayers[intl.get(`leafletMap.externalLayers.${id}`)]
    leafletOverlay.clearLayers()
  }

  addMapModeControl = () => {
    L.Control.Mapmode = L.Control.extend({
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
        markersLabel.textContent = intl.get('leafletMap.mapModeButtons.markers')
        heatmapLabel.for = 'leaflet-control-mapmode-heatmap'
        heatmapLabel.textContent = intl.get('leafletMap.mapModeButtons.heatmap')
        L.DomEvent.on(radioMarkers, 'click', event => this.setState({ mapMode: event.target.value }))
        L.DomEvent.on(radioHeatmap, 'click', event => this.setState({ mapMode: event.target.value }))
        return container
      },
      onRemove: map => {
        // TODO: remove DOM events?
      }
    })
    L.control.mapmode = opts => {
      return new L.Control.Mapmode(opts)
    }
    L.control.mapmode({ position: 'topleft' }).addTo(this.leafletMap)
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
        const color = result.markerColor || 'green'
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
          case 'yellow':
            markerIcon = markerIconYellow
            break
          default:
            markerIcon = markerIconGreen
        }
        marker = L.marker(latLng, {
          icon: new ColorIcon({ iconUrl: markerIcon }),
          id: result.id,
          prefLabel: result.prefLabel ? result.prefLabel : null,
          events: result.events ? result.events : null
        })
      }
      if (this.props.pageType === 'facetResults' || this.props.pageType === 'instancePage') {
        marker.on('click', this.markerOnClickFacetResults)
      }
      // if (this.props.pageType === 'instancePage') {
      //   marker.bindPopup(this.createPopUpContent(marker.options))
      // }
      if (this.props.pageType === 'clientFSResults') {
        marker.bindPopup(this.createPopUpContentNameSampo(result))
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

  createPopUpContentNameSampo = data => {
    const { perspectiveID } = this.props
    let popUpTemplate = ''
    popUpTemplate += `<a href=${data.id} target='_blank'><h3>${data.prefLabel}</h3></a>`
    if (has(data, 'broaderTypeLabel')) {
      popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.broaderTypeLabel.label`)}</b>: ${data.broaderTypeLabel}</p>`
    }
    if (has(data, 'broaderAreaLabel')) {
      popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.broaderAreaLabel.label`)}</b>: ${data.broaderAreaLabel}</p>`
    }
    if (has(data, 'modifier')) {
      popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.modifier.label`)}</b>: ${data.modifier}</p>`
    }
    if (has(data, 'basicElement')) {
      popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.basicElement.label`)}</b>: ${data.basicElement}</p>`
    }
    if (has(data, 'collectionYear')) {
      popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.collectionYear.label`)}</b>: ${data.collectionYear}</p>`
    }
    if (has(data, 'source')) {
      if (data.namesArchiveLink !== '-') {
        popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.source.label`)}</b>: 
          <a href="${data.namesArchiveLink}" target="_blank">${data.source}</a></p>`
      } else {
        popUpTemplate += `
        <p><b>${intl.get(`perspectives.${perspectiveID}.properties.source.label`)}</b>: ${data.source}</p>`
      }
    }
    return popUpTemplate
  }

  createPopUpContentGeoJSON = (layerID, properties) => {
    if (layerID === 'arkeologiset_kohteet_alue' || layerID === 'arkeologiset_kohteet_piste') {
      return this.createPopUpContentGeoJSONFHA(properties)
    } else {
      return this.createPopUpContentGeoJSONKotus(properties)
    }
  }

  createPopUpContentGeoJSONFHA = properties => {
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

  createPopUpContentGeoJSONKotus = properties => {
    let popupText = ''
    const name = `<b>Pitäjän nimi:</b> ${properties.NIMI}</p>`
    popupText += `
      <div>
        ${name}
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

  createOpacitySlider = overlayLayers => {
    L.control.opacity(
      overlayLayers,
      {
        label: null,
        collapsed: true
      }
    ).addTo(this.leafletMap)
  }

  render = () => {
    return (
      <>
        <div className={this.props.classes[`leafletContainer${this.props.pageType}`]}>
          <div id={this.props.container ? this.props.container : 'map'} className={this.props.classes.mapElement} />
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
  results: PropTypes.array,
  layers: PropTypes.object,
  facetID: PropTypes.string,
  facet: PropTypes.object,
  instance: PropTypes.object,
  facetUpdateID: PropTypes.number,
  fetchResults: PropTypes.func,
  fetchGeoJSONLayers: PropTypes.func,
  clearGeoJSONLayers: PropTypes.func,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  fetchByURI: PropTypes.func,
  fetching: PropTypes.bool.isRequired,
  mapMode: PropTypes.string,
  showInstanceCountInClusters: PropTypes.bool,
  showExternalLayers: PropTypes.bool,
  updateFacetOption: PropTypes.func,
  facetedSearchMode: PropTypes.string,
  container: PropTypes.string,
  showError: PropTypes.func,
  uri: PropTypes.string
}

export const LeafletMapComponent = LeafletMap

export default withStyles(styles)(LeafletMap)
