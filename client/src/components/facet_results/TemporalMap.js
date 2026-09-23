import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'tss-react/mui'
import intl from 'react-intl-universal'
import ReactMapGL, { Map, useControl, FullscreenControl, NavigationControl, AttributionControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

import DeckGL, { ScatterplotLayer } from 'deck.gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox'
import Paper from '@mui/material/Paper'
import TemporalMapTimeSlider from 'components/facet_results/TemporalMapTimeSlider'
import 'components/facet_results/TemporalMapCommon.scss'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { has } from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

const styles = (theme) => ({
  root: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    },
    position: 'relative'
  },
  tooltipContainer: {
    position: 'absolute',
    zIndex: 1,
    padding: theme.spacing(1),
    maxWidth: 500
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.spacing(1),
    zIndex: 1
  },
  fullscreenButton: {
    marginTop: theme.spacing(1)
  },
  spinner: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)'
  }
})

// https://github.com/visgl/deck.gl/blob/master/examples/website/maplibre/app.tsx
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props))
  overlay.setProps(props)
  return null
}

/**
 * A component for displaying a WebGL map with an animated layer.
 * Based on https://github.com/AdriSolid/DECK.GL-Time-Slider
 */
class TemporalMap extends Component {
  constructor (props) {
    super(props)
    this.mapElementRef = React.createRef()
    this.state = {
      viewport: {
        longitude: 26.91,
        latitude: 62.326,
        zoom: 5.5,
        pitch: 0,
        bearing: 0
      },
      data: [],
      memory: [],
      dates: [],
      mounted: false
    }
  }

  componentDidMount () {
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass
    })
    this.setState({ mounted: true })
  }

  componentDidUpdate = prevProps => {
    if (prevProps.results !== this.props.results) {
      const uniqueDates = this.props.results
        .map(d => d.startDate)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort()
      const startDate = uniqueDates[0]
      const endDate = uniqueDates[uniqueDates.length - 1]
      const range = moment.range(startDate, endDate)
      let days = Array.from(range.by('day'))
      days = days.map(m => m.format('YYYY-MM-DD'))
      const sliderValue = this.props.animationValue[0]
      const filteredData = this._filterData(sliderValue, this.props.results, days)
      this.setState({
        data: filteredData,
        memory: this.props.results,
        dates: days
      })
    }

    if (prevProps.animationValue !== this.props.animationValue) {
      const { memory, dates } = this.state
      const sliderValue = this.props.animationValue[0]
      const filteredData = this._filterData(sliderValue, memory, dates)
      this.setState({
        data: filteredData
      })
    }

    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.animateMap([0]) // reset time slider
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }
  }

  _filterData = (sliderValue, data, dates) => {
    const animationCurrentDate = Date.parse(dates[sliderValue])
    const newData = data.filter(value => {
      return Date.parse(value.startDate) <= animationCurrentDate
    })
    newData.map(value => {
      const startDate = Date.parse(value.startDate)
      const range = moment.range(startDate, animationCurrentDate)
      if (range.diff('days') >= 2) {
        value.isNew = false
      } else {
        value.isNew = true
      }
      return value
    })
    return newData
  }

  _renderTooltip () {
    const { hoveredObject, pointerX, pointerY } = this.state || {}
    const greaterPlaceLabel = intl.get(`temporalMap.resultClasses.${this.props.resultClass}.greaterPlace`)
    const startDateLabel = intl.get(`temporalMap.resultClasses.${this.props.resultClass}.startDate`)
    const endDateLabel = intl.get(`temporalMap.resultClasses.${this.props.resultClass}.endDate`)
    const descriptionLabel = intl.get(`temporalMap.resultClasses.${this.props.resultClass}.description`)
    return hoveredObject && (
      <Paper className={this.props.classes.tooltipContainer} style={{ left: pointerX + 10, top: pointerY + 10 }}>
        <Typography variant='h6'>
          {hoveredObject.prefLabel}
        </Typography>
        {has(hoveredObject, 'greaterPlace') && 
          <Typography>
            {greaterPlaceLabel ? `${greaterPlaceLabel}: ` : ''}{hoveredObject.greaterPlace}
          </Typography>}
        <Typography>
          {startDateLabel ? `${startDateLabel}: ` : ''}{moment(hoveredObject.startDate).format('DD.MM.YYYY')}
        </Typography>
        {has(hoveredObject, 'endDate') &&
          <Typography>
            {endDateLabel ? `${endDateLabel}: ` : ''}{moment(hoveredObject.endDate).format('DD.MM.YYYY')}
          </Typography>}
        {has(hoveredObject, 'description') &&
          <Typography>
            {descriptionLabel ? `${descriptionLabel}: ` : ''}{hoveredObject.description}
          </Typography>}
      </Paper>
    )
  }

  _renderLayers () {
    const { data } = this.state
    return [
      new ScatterplotLayer({
        id: 'time-layer',
        data,
        opacity: this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.opacity ?? 0.3,
        stroked: true,
        filled: true,
        radiusScale: this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.radiusScale ?? 15,
        radiusMinPixels: this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.radiusMinPixels ?? 8,
        radiusMaxPixels: this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.radiusMaxPixels ?? 100,
        lineWidthMinPixels: 1,
        getPosition: d => [+d.long, +d.lat],
        getFillColor: d => d.isNew ? [255, 0, 0] : [0, 0, 0],
        ...(this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.radiusVariable && { 
          getRadius: d => (this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.radiusVariableMultiplier ?? 1) * d[this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.radiusVariable] 
        }),
        pickable: true,
        autoHighlight: true,
        onHover: info => this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y
        })
      })
    ]
  }

  getMapStyle = () => {
    const { portalConfig } = this.props

    return {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      layers: [{
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 22
      }]
    }

    // fallback gray base
    /*return {
      version: 8,
      sources: {},
      layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#e0e0e0' } }]
    }*/
  }

  renderSpinner () {
    if (this.props.fetching) {
      return (
        <div className={this.props.classes.spinner}>
          <CircularProgress />
        </div>
      )
    }
    return null
  }

  handleOnViewportChange = viewport =>
    this.state.mounted && this.setState({ viewport })

  render () {
    const { viewport, memory, dates } = this.state
    const { classes, animateMap, portalConfig } = this.props
    return (
      <div id='temporal-map-root' ref={this.mapElementRef} className={classes.root}>
        <Map
          {...viewport}
          reuseMaps
          mapStyle={this.getMapStyle()}
          preventStyleDiffing
          onViewportChange={this.handleOnViewportChange}
          onMove={(evt) => this.handleOnViewportChange(evt.viewState)}
          attributionControl={false}
          style={{ width: '100%', height: '100%', zIndex: '0' }}
        >
          <div className={classes.navigationContainer}>
            <NavigationControl />
            <FullscreenControl
              className={classes.fullscreenButton}
              container={document.querySelector('temporal-map-root')}
            />
          </div>
          <DeckGLOverlay
            layers={this._renderLayers()}
            viewState={viewport}
          />
          {this.renderSpinner()}
        </Map>
        <TemporalMapTimeSlider
          mapElementRef={this.mapElementRef}
          memory={memory}
          dates={dates}
          animateMap={animateMap}
          initialValue={this.props.animationValue[0]}
          sliderDuration={this.props.perspectiveConfig.resultClasses[this.props.resultClass].componentConfig?.sliderDuration}
        />
        {this._renderTooltip()}
      </div>
    )
  }
}

TemporalMap.propTypes = {
  /**
   * Material-UI styles.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Faceted search results.
   */
  results: PropTypes.array,
  /**
   * Result class for fetching the results.
   */
  resultClass: PropTypes.string.isRequired,
  /**
   * Facet class for fetching the results.
   */
  facetClass: PropTypes.string.isRequired,
  /**
   * Redux action for fetching the results.
   */
  fetchResults: PropTypes.func.isRequired,
  /**
   * State of the animation.
   */
  animationValue: PropTypes.array.isRequired,
  /**
   * Redux action for animation.
   */
  animateMap: PropTypes.func.isRequired,
  /**
   * ID for detecting updates in facets.
   */
  facetUpdateID: PropTypes.number.isRequired,
  /**
   * Loading indicator.
   */
  fetching: PropTypes.bool.isRequired
}

export const TemporalMapComponent = TemporalMap

export default withStyles(TemporalMap, styles)
