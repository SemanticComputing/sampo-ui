import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import ReactMapGL, { NavigationControl, FullscreenControl } from 'react-map-gl'
import DeckGL, { ScatterplotLayer } from 'deck.gl'
import Paper from '@material-ui/core/Paper'
import TemporalMapTimeSlider from './TemporalMapTimeSlider'
import './TemporalMapCommon.scss'
import Typography from '@material-ui/core/Typography'
import { has } from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

const styles = theme => ({
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
  }
})
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
  };

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
    return hoveredObject && (
      <Paper className={this.props.classes.tooltipContainer} style={{ left: pointerX + 10, top: pointerY + 10 }}>
        <Typography variant='h6'>
          {hoveredObject.prefLabel}
        </Typography>
        <Typography>
          {intl.get('perspectives.battles.temporalMap.municipality')}: {hoveredObject.greaterPlace}
        </Typography>
        <Typography>
          {intl.get('perspectives.battles.properties.startDate.label')}: {moment(hoveredObject.startDate).format('DD.MM.YYYY')}
        </Typography>
        <Typography>
          {intl.get('perspectives.battles.properties.endDate.label')}: {moment(hoveredObject.endDate).format('DD.MM.YYYY')}
        </Typography>
        {has(hoveredObject, 'units') &&
          <Typography>
            {intl.get('perspectives.battles.properties.units.description')}: {hoveredObject.units}
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
        opacity: 0.3,
        stroked: true,
        filled: true,
        radiusScale: 15,
        radiusMinPixels: 8,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: d => [+d.long, +d.lat],
        getFillColor: d => d.isNew ? [255, 0, 0] : [0, 0, 0],
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

  handleOnViewportChange = viewport =>
    this.state.mounted && this.setState({ viewport });

  render () {
    const { viewport, memory, dates } = this.state
    const { classes, animateMap, mapBoxStyle, mapboxApiAccessToken } = this.props
    return (
      <div id='temporal-map-root' ref={this.mapElementRef} className={classes.root}>
        <ReactMapGL
          {...viewport}
          width='100%'
          height='100%'
          reuseMaps
          mapStyle={`mapbox://styles/mapbox/${mapBoxStyle}`}
          preventStyleDiffing
          mapboxApiAccessToken={mapboxApiAccessToken}
          onViewportChange={this.handleOnViewportChange}
        >
          <div className={classes.navigationContainer}>
            <NavigationControl />
            <FullscreenControl
              className={classes.fullscreenButton}
              container={document.querySelector('temporal-map-root')}
            />
          </div>
          <DeckGL
            layers={this._renderLayers()}
            viewState={viewport}
          />
          <TemporalMapTimeSlider
            mapElementRef={this.mapElementRef}
            memory={memory}
            dates={dates}
            animateMap={animateMap}
            initialValue={this.props.animationValue[0]}
            sliderDuration={this.props.sliderDuration}
          />
          {this._renderTooltip()}
        </ReactMapGL>
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
  results: PropTypes.array.isRequired,
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
  facetUpdateID: PropTypes.number.isRequired
}

export const TemporalMapComponent = TemporalMap

export default withStyles(styles)(TemporalMap)
