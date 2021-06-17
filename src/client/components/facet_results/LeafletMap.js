import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import L from 'leaflet'
import { has, isEqual } from 'lodash'
import CircularProgress from '@material-ui/core/CircularProgress'
import { purple } from '@material-ui/core/colors'
import history from '../../History'
// import { apiUrl } from '../../epics'
import 'leaflet/dist/leaflet.css' // Official Leaflet styles

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
import 'leaflet-usermarker/src/leaflet.usermarker.js'
import 'leaflet-usermarker/src/leaflet.usermarker.css'
// import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js'

import markerShadowIcon from '../../img/markers/marker-shadow.png'
import markerIconViolet from '../../img/markers/marker-icon-violet.png'
import markerIconGreen from '../../img/markers/marker-icon-green.png'
import markerIconRed from '../../img/markers/marker-icon-red.png'
import markerIconOrange from '../../img/markers/marker-icon-orange.png'
import markerIconYellow from '../../img/markers/marker-icon-yellow.png'

const buffer = lazy(() => import('@turf/buffer'))

const styles = theme => ({
  leafletContainerfacetResults: props => ({
    height: 400,
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${props.layoutConfig.tabHeight}px)`
    },
    position: 'relative'
  }),
  leafletContainerclientFSResults: props => ({
    height: 400,
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${props.layoutConfig.tabHeight}px)`
    },
    position: 'relative'
  }),
  leafletContainerinstancePage: props => ({
    height: 400,
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '100%'
    },
    position: 'relative'
  }),
  leafletContainermobileMapPage: {
    height: '100%',
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
      activeLayers: props.activeLayers ? props.activeLayers : [],
      prevZoomLevel: null,
      enlargedBounds: null,
      mapMode: props.mapMode,
      showBuffer: true
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
    if (this.props.showExternalLayers && !this.props.locateUser) {
      this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'programmatic' })
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
      (this.props.leafletMapState.updateID !== prevProps.leafletMapState.updateID)) {
      this.props.leafletMapState.layerData.map(layerObj => this.populateOverlay(layerObj))
    }
  }

  serverFScomponentDidUpdate = (prevProps, prevState) => {
    // check if map center or zoom was modified in Redux state
    if (!this.locateUser() && !this.componentStateEqualsReduxState()) {
      this.leafletMap.setView(this.props.center, this.props.zoom)
    }

    // check if filters have changed
    if (has(prevProps, 'facetUpdateID') && prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null,
        reason: 'facetUpdate'
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
        .bindPopup(this.props.createPopUpContent({
          data: this.props.instance,
          resultClass: this.props.resultClass
        }), {
          ...(this.props.popupMaxHeight && { maxHeight: this.props.popupMaxHeight }),
          ...(this.props.popupMinWidth && { minWidth: this.props.popupMinWidth })
        })
        .openPopup()
    }

    if (this.props.showExternalLayers &&
      (this.props.leafletMapState.updateID !== prevProps.leafletMapState.updateID)) {
      this.props.leafletMapState.layerData.map(layerObj => this.populateOverlay(layerObj))
    }

    if (this.props.showExternalLayers) {
      if (this.props.customMapControl) {
        this.setCustomMapControlVisibility()
      }
      if (this.props.leafletMapState.fetching) {
        if (this.props.customMapControl) {
          document.getElementById('leaflet-control-custom-checkbox-buffer').disabled = true
        }
        this.layerControl._layerControlInputs.forEach(input => { input.disabled = true })
        this.leafletMap.removeControl(this.zoominfoControl)
        this.leafletMap.dragging.disable()
        this.leafletMap.touchZoom.disable()
        this.leafletMap.doubleClickZoom.disable()
        this.leafletMap.scrollWheelZoom.disable()
        this.leafletMap.boxZoom.disable()
        this.leafletMap.keyboard.disable()
        if (this.leafletMap.tap) this.leafletMap.tap.disable()
      }
      if (!this.props.leafletMapState.fetching) {
        if (this.props.customMapControl) {
          document.getElementById('leaflet-control-custom-checkbox-buffer').disabled = false
        }

        // Re-enable layer checkboxes only if zoom level is suitable
        this.layerControl._layerControlInputs.forEach(input => {
          const leafletID = input.layerId
          let minZoom = null
          for (const layer in this.overlayLayers) {
            if (this.overlayLayers[layer]._leaflet_id === leafletID) {
              const layerObj = this.overlayLayers[layer]
              if (layerObj.options.minZoom) {
                minZoom = layerObj.options.minZoom
              }
            }
          }
          if (minZoom === null || this.leafletMap.getZoom() >= minZoom) {
            input.disabled = false
          }
        })

        this.leafletMap.addControl(this.zoominfoControl)
        this.leafletMap.dragging.enable()
        this.leafletMap.touchZoom.enable()
        this.leafletMap.doubleClickZoom.enable()
        this.leafletMap.scrollWheelZoom.enable()
        this.leafletMap.boxZoom.enable()
        this.leafletMap.keyboard.enable()
        if (this.leafletMap.tap) this.leafletMap.tap.enable()
      }
    }

    if (has(prevProps, 'facet') && prevProps.facet.filterType !== this.props.facet.filterType) {
      if (this.props.facet.filterType === 'spatialFilter') {
        this.addDrawButtons()
      } else {
        this.removeDrawButtons()
      }
    }

    if (prevState.showBuffer !== this.state.showBuffer) {
      this.state.activeLayers.map(layerID => {
        const leafletOverlayToRemove = this.overlayLayers[intl.get(`leafletMap.externalLayers.${layerID}`)]
        leafletOverlayToRemove.clearLayers()
      })
      this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'programmatic' })
    }

    if (prevProps.infoHeaderExpanded && (prevProps.infoHeaderExpanded !== this.props.infoHeaderExpanded)) {
      this.leafletMap.invalidateSize()
    }
  }

  initMap = () => {
    // Base layer(s)
    const mapboxBaseLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/${this.props.mapBoxStyle}/tiles/{z}/{x}/{y}?access_token=${this.props.mapBoxAccessToken}`, {
      attribution: '&copy; <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener">Mapbox</a> &copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      tileSize: 512,
      zoomOffset: -1
    })

    /*
      Password protected base layers from https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts
      Routed via backend.
    */
    // const backgroundMapNLS = L.tileLayer(`${process.env.API_URL}/nls-wmts?z={z}&x={x}&y={y}&layerID=taustakartta`, {
    //   attribution: 'National Land Survey of Finland',
    //   maxZoom: 18
    // })
    // const topographicalMapNLS = L.tileLayer(`${process.env.API_URL}/nls-wmts?z={z}&x={x}&y={y}&layerID=maastokartta`, {
    //   attribution: 'National Land Survey of Finland',
    //   maxZoom: 18
    // })
    // const airMapNLS = L.tileLayer(`${process.env.API_URL}/nls-wmts?z={z}&x={x}&y={y}&layerID=ortokuva`, {
    //   attribution: 'National Land Survey of Finland',
    //   maxZoom: 18
    // })
    // const googleRoadmap = L.gridLayer.googleMutant({
    //   type: 'roadmap'
    // })

    // layer for markers
    this.resultMarkerLayer = L.layerGroup()

    const container = this.props.container ? this.props.container : 'map'
    const locateUser = this.locateUser()
    this.leafletMap = L.map(container, {
      ...(!locateUser && {
        center: this.props.center,
        zoom: this.props.zoom
      }),
      zoomControl: false,
      zoominfoControl: true,
      layers: [
        mapboxBaseLayer,
        this.resultMarkerLayer
      ],
      fullscreenControl: true
    }).whenReady(context => {
      this.updateEnlargedBounds({ mapInstance: context.target })
    })

    this.zoominfoControl = this.leafletMap.zoominfoControl

    if (this.props.customMapControl) {
      this.addCustomMapControl()
      this.setCustomMapControlVisibility()
    }

    if (this.props.locateUser) {
      this.leafletMap.on('locationfound', this.onLocationFound)
      this.leafletMap.on('locationerror', this.onLocationError)
      this.leafletMap.locate({
        // watch: true,
        // setView: true,
        // maxZoom: 14,
        enableHighAccuracy: true
      })
    }

    // initialize layers from external sources
    if (this.props.showExternalLayers) {
      const basemaps = {
        [intl.get(`leafletMap.basemaps.mapbox.${this.props.mapBoxStyle}`)]: mapboxBaseLayer
        // [intl.get('leafletMap.basemaps.backgroundMapNLS')]: backgroundMapNLS,
        // [intl.get('leafletMap.basemaps.topographicalMapNLS')]: topographicalMapNLS,
        // [intl.get('leafletMap.basemaps.airMapNLS')]: airMapNLS
        // [intl.get('leafletMap.basemaps.googleRoadmap')]: googleRoadmap,
      }
      this.initOverLays(basemaps)
      if (!this.props.locateUser) {
        this.initMapEventListenersForExternalLayers()
      }
    }

    // Add scale
    L.control.scale().addTo(this.leafletMap)

    // create layer for bounding boxes
    if (has(this.props, 'facet') && this.props.facet.filterType === 'spatialFilter') {
      this.addDrawButtons()
    }

    if (this.props.updateMapBounds && !locateUser) {
      this.updateMapBounds()
      this.initMapEventListenersForBounds()
    }
  }

  updateMapBounds = () => {
    if (!this.componentStateEqualsReduxState()) {
      this.props.updateMapBounds({
        resultClass: this.props.resultClass,
        bounds: this.boundsToObject()
      })
    }
  }

  componentStateEqualsReduxState = () => {
    if (this.leafletMap.getZoom() == null) { return true }
    const currentZoom = this.leafletMap.getZoom()
    const currentCenter = this.leafletMap.getCenter()
    return (
      currentZoom === this.props.zoom &&
      currentCenter[0] === this.props.center[0] &&
      currentCenter[1] === this.props.center[1]
    )
  }

  setCustomMapControlVisibility = () => {
    const { activeLayers } = this.state
    let hideCustomControl = true
    activeLayers.map(layerID => {
      if (layerID === 'WFS_MV_KulttuuriymparistoSuojellut:Muinaisjaannokset_alue' ||
      layerID === 'WFS_MV_KulttuuriymparistoSuojellut:Muinaisjaannokset_piste' ||
      layerID === 'WFS_MV_Kulttuuriymparisto:Arkeologiset_kohteet_alue' ||
      layerID === 'WFS_MV_Kulttuuriymparisto:Arkeologiset_kohteet_piste'
      ) {
        hideCustomControl = false
      }
    })
    if (hideCustomControl) {
      document.getElementById('leaflet-control-custom-container-buffer').style.display = 'none'
    } else {
      document.getElementById('leaflet-control-custom-container-buffer').style.display = 'block'
    }
  }

  locateUser = () => {
    if (this.props.locateUser && this.props.locateUser === true) {
      return true
    }
    return false
  }

  onLocationFound = e => {
    this.leafletMap.setView(e.latlng, 13)
    this.updateEnlargedBounds({ mapInstance: this.leafletMap })
    L.userMarker(e.latlng, {
      pulsing: true,
      accuracy: e.accuracy,
      smallIcon: true
    })
      .addTo(this.leafletMap)
      .bindPopup('You are within ' + e.accuracy + ' meters from this point')
      // .openPopup()
    this.initMapEventListenersForExternalLayers()
    this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'programmatic' })
    this.updateMapBounds()
    this.initMapEventListenersForBounds()
  }

  onLocationError = e => {
    this.leafletMap.setView(
      this.props.center,
      this.props.zoom
    )
    this.initMapEventListenersForExternalLayers()
    this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'programmatic' })
    this.updateMapBounds()
    this.initMapEventListenersForBounds()
    // this.props.showError({
    //   title: '',
    //   text: e.message
    // })
  }

  boundsToObject = () => {
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
      center: this.leafletMap.getCenter(),
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

  initMapEventListenersForBounds = () => {
    // Fired when zooming ends
    this.leafletMap.on('zoomend', event => {
      this.updateMapBounds()
    })

    // Fired when dragging ends
    this.leafletMap.on('dragend', () => {
      this.updateMapBounds()
    })
  }

  // event listeners, only used when this.props.showExternalLayers
  initMapEventListenersForExternalLayers = () => {
    // Fired when an overlay is selected using layer controls
    this.leafletMap.on('layeradd', event => {
      const layerID = event.layer.options.id
      if (event.layer.options.type === 'GeoJSON' && !this.state.activeLayers.includes(layerID)) {
        // console.log(`add: ${layerID}`)
        if (this.isSafeToLoadLargeLayers()) {
          const currentLayers = this.state.activeLayers
          // https://www.robinwieruch.de/react-state-array-add-update-remove
          this.setState(state => {
            return {
              activeLayers: [...currentLayers, layerID]
            }
          })
          this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'programmatic' })
        } else {
          this.props.showError({
            title: '',
            text: intl.get('leafletMap.wrongZoomLevelFHA')
          })
        }
      }
    })

    // Fired when a layer is removed from the map
    this.leafletMap.on('layerremove', event => {
      if (event.layer.options.type === 'GeoJSON') {
        const layerIDToRemove = event.layer.options.id
        // console.log(`remove: ${layerIDToRemove}`)
        const leafletOverlayToRemove = this.overlayLayers[intl.get(`leafletMap.externalLayers.${layerIDToRemove}`)]
        leafletOverlayToRemove.clearLayers()
        this.setState(state => {
          const activeLayers = state.activeLayers.filter(layerID => layerID !== layerIDToRemove)
          return { activeLayers }
        })
      }
    })

    // Fired when zooming starts
    this.leafletMap.on('zoomstart', () => {
      if (this.props.showExternalLayers) {
        this.setState({ prevZoomLevel: this.leafletMap.getZoom() })
      }
    })

    // Fired when zooming ends
    this.leafletMap.on('zoomend', event => {
      this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'zoomend' })
    })

    // Fired when dragging ends
    this.leafletMap.on('dragend', () => {
      this.maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers({ eventType: 'dragend' })
    })
  }

  initOverLays = basemaps => {
    this.overlayLayers = {}
    const opacityLayers = {}
    let showOpacityController = false
    this.props.layerConfigs.map(config => {
      switch (config.type) {
        case 'GeoJSON':
          this.overlayLayers[intl.get(`leafletMap.externalLayers.${config.id}`)] =
            L.layerGroup([], config)
          break
        case 'WMS':
          this.overlayLayers[intl.get(`leafletMap.externalLayers.${config.id}`)] =
            L.tileLayer.wms(config.url, {
              layers: config.layers,
              version: config.version,
              minZoom: config.minZoom,
              maxZoom: config.maxZoom,
              attribution: config.attribution
            })
          break
        case 'WMTS': {
          const wmtsLayer = L.tileLayer(config.url, {
            attribution: config.attribution
          })
          const translatedLayerID = intl.get(`leafletMap.externalLayers.${config.id}`)
          this.overlayLayers[translatedLayerID] = wmtsLayer
          if (config.opacityControl) {
            opacityLayers[translatedLayerID] = wmtsLayer
            showOpacityController = true
          }
          break
        }
      }
    })

    // Add default active overlays directly to the map
    this.state.activeLayers.map(overlay => {
      this.leafletMap.addLayer(this.overlayLayers[intl.get(`leafletMap.externalLayers.${overlay}`)])
    })

    // Add all basemaps and all overlays via the control to the map
    this.layerControl = L.control.layers(basemaps, this.overlayLayers, { collapsed: !this.props.layerControlExpanded }).addTo(this.leafletMap)

    // Create opacity controller if needed
    if (showOpacityController) {
      this.createOpacitySlider(opacityLayers)
    }
  }

  updateEnlargedBounds = ({ mapInstance }) => {
    const currentBounds = mapInstance.getBounds()
    const enlargedBounds = currentBounds.pad(1.5)
    this.setState({ enlargedBounds })
  }

  maybeUpdateEnlargedBoundsAndFetchGeoJSONLayers = ({ eventType }) => {
    if (this.state.activeLayers.length === 0) {
      return
    }
    const currentBounds = this.leafletMap.getBounds()

    // When user triggers zoom or drag event and map is within enlarged bounds, do nothing
    if (eventType !== 'programmatic' && this.props.leafletMapState.updateID > 0 && this.state.enlargedBounds.contains(currentBounds)) {
      return
    }

    const safeFunc = eventType === 'zoomend' ? this.isSafeToLoadLargeLayersAfterZooming : this.isSafeToLoadLargeLayers
    if (this.props.leafletMapState.fetching || this.state.activeLayers.length < 0 || !safeFunc()) {
      return
    }
    // console.log('setting new enlarged bounds')
    const enlargedBounds = currentBounds.pad(1.5)
    this.setState({ enlargedBounds })
    // console.log('fetching new GeoJSON layers')
    // console.log(enlargedBounds.toBBoxString())
    // L.rectangle(enlargedBounds).addTo(this.leafletMap)
    this.fetchGeoJSONLayers()
  }

  fetchGeoJSONLayers = () => {
    this.props.clearGeoJSONLayers()
    this.props.fetchGeoJSONLayers({
      layerIDs: this.state.activeLayers,
      bounds: this.state.enlargedBounds
    })
  }

  isSafeToLoadLargeLayers = () => this.leafletMap.getZoom() >= 13

  isSafeToLoadLargeLayersAfterZooming = () => {
    const currentZoom = this.leafletMap.getZoom()
    return (currentZoom === 13 ||
      (currentZoom >= 13 && this.state.prevZoomLevel > currentZoom))
  }

  populateOverlay = layerObj => {
    /*
      The baseLayers and overlays parameters are object literals with layer names as keys
      and Layer objects as values
    */

    const leafletOverlay = this.overlayLayers[intl.get(`leafletMap.externalLayers.${layerObj.layerID}`)]
    leafletOverlay.clearLayers()

    // Only the layer that is added last is clickable, so add buffer first
    if (this.state.showBuffer) {
      const { distance, units, style } = leafletOverlay.options.buffer
      try {
        const bufferedGeoJSON = buffer(layerObj.geoJSON, distance, { units })
        const leafletGeoJSONBufferLayer = L.geoJSON(bufferedGeoJSON, {
          // style for GeoJSON Polygons
          style
        })
        leafletGeoJSONBufferLayer.addTo(leafletOverlay).addTo(this.leafletMap)
      } catch (error) {
        console.log(error)
      }
    }

    const { createGeoJSONPointStyle, createGeoJSONPolygonStyle, createPopup } = leafletOverlay.options
    try {
      const leafletGeoJSONLayer = L.geoJSON(layerObj.geoJSON, {
        // style for GeoJSON Points
        ...(createGeoJSONPointStyle &&
          {
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, createGeoJSONPointStyle(feature))
            }
          }),
        // style for GeoJSON Polygons
        ...(createGeoJSONPolygonStyle &&
          {
            style: createGeoJSONPolygonStyle
          }),
        // add popups
        onEachFeature: (feature, layer) => {
          layer.bindPopup(createPopup(feature.properties))
        }
      })
      leafletGeoJSONLayer.addTo(leafletOverlay).addTo(this.leafletMap)
    } catch (error) {
      console.error(error)
    }
  }

  addCustomMapControl = () => {
    L.Control.Mapmode = L.Control.extend({
      onAdd: map => {
        const container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded leaflet-control')
        container.id = 'leaflet-control-custom-container-buffer'
        const checkboxOuterContainer = L.DomUtil.create('label', null, container)
        const checkboxInnerContainer = L.DomUtil.create('div', 'leaflet-control-custom-checkbox-buffer-container', checkboxOuterContainer)

        const checkbox = L.DomUtil.create('input', 'leaflet-control-layers-selector', checkboxInnerContainer)
        checkbox.type = 'checkbox'
        checkbox.id = 'leaflet-control-custom-checkbox-buffer'
        checkbox.checked = this.state.showBuffer
        const checkboxLabel = L.DomUtil.create('span', null, checkboxInnerContainer)
        checkboxLabel.textContent = intl.get('leafletMap.showBufferZones')
        L.DomEvent.on(checkbox, 'click', event => {
          this.setState({ showBuffer: event.target.checked })
        })

        // const markersInputContainer = L.DomUtil.create('div', 'leaflet-control-mapmode-input-container', container)
        // const heatmapInputContainer = L.DomUtil.create('div', 'leaflet-control-mapmode-input-container', container)
        // const radioMarkers = L.DomUtil.create('input', 'leaflet-control-mapmode-input', markersInputContainer)
        // const radioHeatmap = L.DomUtil.create('input', 'leaflet-control-mapmode-input', heatmapInputContainer)
        // const markersLabel = L.DomUtil.create('label', 'leaflet-control-mapmode-label', markersInputContainer)
        // const heatmapLabel = L.DomUtil.create('label', 'leaflet-control-mapmode-label', heatmapInputContainer)
        // radioMarkers.id = 'leaflet-control-mapmode-markers'
        // radioHeatmap.id = 'leaflet-control-mapmode-heatmap'
        // radioMarkers.type = 'radio'
        // radioHeatmap.type = 'radio'
        // radioMarkers.checked = this.state.mapMode === 'cluster'
        // radioHeatmap.checked = this.state.mapMode === 'heatmap'
        // radioMarkers.name = 'mapmode'
        // radioHeatmap.name = 'mapmode'
        // radioMarkers.value = 'cluster'
        // radioHeatmap.value = 'heatmap'
        // markersLabel.for = 'leaflet-control-mapmode-markers'
        // markersLabel.textContent = intl.get('leafletMap.mapModeButtons.markers')
        // heatmapLabel.for = 'leaflet-control-mapmode-heatmap'
        // heatmapLabel.textContent = intl.get('leafletMap.mapModeButtons.heatmap')
        // L.DomEvent.on(radioMarkers, 'click', event => this.setState({ mapMode: event.target.value }))
        // L.DomEvent.on(radioHeatmap, 'click', event => this.setState({ mapMode: event.target.value }))
        return container
      },
      onRemove: map => {
        // TODO: remove DOM events?
      }
    })
    L.control.mapmode = opts => {
      return new L.Control.Mapmode(opts)
    }
    L.control.mapmode({ position: 'topright' }).addTo(this.leafletMap)
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
      const { pageType } = this.props
      if (pageType === 'facetResults') {
        marker.on('click', this.markerOnClickFacetResults)
      }
      if (pageType === 'instancePage' || pageType === 'clientFSResults') {
        marker.bindPopup(this.props.createPopUpContent({
          data: result,
          resultClass: this.props.resultClass
        }))
      }
      return marker
    }
  }

  createNavButton = ({ href, text }) => {
    const el = document.createElement('button')
    el.textContent = text
    el.addEventListener('click', history.push(href))
  }

  markerOnClickFacetResults = event => {
    this.props.fetchByURI({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      uri: event.target.options.id
    })
  };

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
          <div id={this.props.container ? this.props.container : 'map'} className={this.props.classes.mapElement}>
            {(this.props.fetching ||
            (this.props.showExternalLayers && this.props.leafletMapState.fetching)) &&
              <div className={this.props.classes.spinnerContainer}>
                <CircularProgress style={{ color: purple[500] }} thickness={5} />
              </div>}
          </div>
        </div>
      </>
    )
  }
}

LeafletMap.propTypes = {
  classes: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  results: PropTypes.array,
  leafletMapState: PropTypes.object,
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
  uri: PropTypes.string,
  mapBoxStyle: PropTypes.string,
  mapBoxAccessToken: PropTypes.string
}

export const LeafletMapComponent = LeafletMap

export default withStyles(styles)(LeafletMap)
