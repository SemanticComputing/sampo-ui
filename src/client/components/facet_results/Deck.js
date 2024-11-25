import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import DeckGL from '@deck.gl/react'
import { ArcLayer, PolygonLayer } from '@deck.gl/layers'
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers'
import ReactMapGL, { NavigationControl, FullscreenControl, HTMLOverlay } from 'react-map-gl'
import DeckArcLayerLegend from './DeckArcLayerLegend'
import DeckArcLayerDialog from './DeckArcLayerDialog'
import DeckArcLayerTooltip from './DeckArcLayerTooltip'
import CircularProgress from '@mui/material/CircularProgress'
import history from '../../History'
import querystring from 'querystring'

/* Documentation links:
  https://deck.gl/#/documentation/getting-started/using-with-react?section=adding-a-base-map
  https://github.com/uber/deck.gl/blob/6.2-release/examples/website/arc/app.js
  http://deck.gl/#/documentation/deckgl-api-reference/layers/arc-layer
  https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
  https://www.mapbox.com/mapbox-gl-js/api#map
*/

const styles = theme => ({
  root: props => ({
    height: 400,
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${props.layoutConfig.tabHeight}px)`
    }
  }),
  spinner: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)'
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.spacing(1),
    zIndex: 1
  },
  fullscreenButton: {
    position: 'absolute',
    top: 105
  }
})

/**
 * A component for WebGL maps using deck.gl and ReactMapGL.
 */
class Deck extends React.Component {
  state = {
    viewport: {
      longitude: this.props.center[1],
      latitude: this.props.center[0],
      zoom: this.props.zoom,
      pitch: 0,
      bearing: 0,
      width: 100,
      height: 100
    },
    dialog: {
      open: false,
      data: null,
      from: null,
      to: null
    },
    hoverInfo: null,
    defaultFacetFetchingRequired: false
  }

  componentDidMount = () => {
    let constraints = []

    // first check if page or constraints were given as url parameter
    if (this.props.location.search !== '') {
      const qs = this.props.location.search.replace('?', '')
      const parsedConstraints = querystring.parse(qs).constraints
      constraints = parsedConstraints ? JSON.parse(decodeURIComponent(parsedConstraints)) : []
    }

    // update imported facets
    for (const constraint of constraints) {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: constraint.facetId,
        option: constraint.filterType,
        value: constraint.value
      })
    }

    // check if default facets need to be refetched due to imported facets
    if (constraints.length > 0) {
      // remove query from URL
      history.replace({
        pathname: `${this.props.rootUrl}/${this.props.facetClass}/faceted-search/${this.props.tabPath}`
      })

      this.setState({ defaultFacetFetchingRequired: true })
    }

    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      sortBy: null
    })
    this.setState({ mounted: true })
  }

  componentDidUpdate = prevProps => {
    // check if facets are still fetching
    let someFacetIsFetching = false
    if (this.props.pageType === 'facetResults' && this.props.facetState) Object.values(this.props.facetState.facets).forEach(facet => { if (facet.isFetching) { someFacetIsFetching = true } })

    // refetch default facets (excl. text facets) when facets have been updated
    if (this.state.defaultFacetFetchingRequired && this.props.facetUpdateID > 0 && !someFacetIsFetching) {
      const defaultFacets = this.props.perspectiveConfig.defaultActiveFacets
      for (const facet of defaultFacets) {
        if (this.props.perspectiveConfig.facets[facet].filterType !== 'textFilter') this.props.fetchFacet({ facetClass: this.props.facetClass, facetID: facet })
      }
      this.setState({ defaultFacetFetchingRequired: false })
    }

    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }
    // if (prevProps.instanceAnalysisDataUpdateID !== this.props.instanceAnalysisDataUpdateID) {
    //   this.setState({
    //     dialog: { data: this.props.instanceAnalysisData }
    //   })
    // }
  }

  componentStateEqualsReduxState = () => {
    const { viewport } = this.state
    const { longitude, latitude, zoom } = viewport
    return (
      zoom === this.props.zoom &&
      longitude === this.props.center[1] &&
      latitude === this.props.center[0]
    )
  }

  setDialog = info => {
    this.setState({
      dialog: {
        open: true,
        from: info.object.from,
        to: info.object.to
      }
    })
    this.props.fetchInstanceAnalysis({
      resultClass: `${this.props.resultClass}Dialog`,
      facetClass: this.props.facetClass,
      fromID: info.object.from.id,
      toID: info.object.to.id
    })
  }

  closeDialog = () =>
    this.setState({
      dialog: {
        open: false,
        data: null
      }
    })

  handleOnViewportChange = viewport => {
    if (this.state.mounted) {
      this.setState({ viewport })
    }
  }

  renderSpinner () {
    if (this.props.fetching || this.props.fetchingInstanceAnalysisData) {
      return (
        <div className={this.props.classes.spinner}>
          <CircularProgress />
        </div>
      )
    }
    return null
  }

  parseCoordinates = data => [+data.long, +data.lat]

  createArcLayer = data =>
    new ArcLayer({
      id: 'arc-layer',
      data,
      pickable: true,
      getWidth: this.props.getArcWidth ? this.props.getArcWidth : 3,
      getSourceColor: [0, 0, 255, 255],
      getTargetColor: [255, 0, 0, 255],
      getSourcePosition: d => this.parseCoordinates(d.from),
      getTargetPosition: d => this.parseCoordinates(d.to),
      onClick: info => this.setDialog(info),
      onHover: info => this.setState({ hoverInfo: info }),
      autoHighlight: true
    })

  createHeatmapLayer = data =>
    new HeatmapLayer({
      id: 'heatmapLayer',
      data,
      ...(this.props.perspectiveConfig.resultClasses[this.props.resultClass].heatmapRadiusPixels && { radiusPixels: this.props.perspectiveConfig.resultClasses[this.props.resultClass].heatmapRadiusPixels }),
      ...(this.props.perspectiveConfig.resultClasses[this.props.resultClass].heatmapThreshold && { threshold: this.props.perspectiveConfig.resultClasses[this.props.resultClass].heatmapThreshold }),
      ...(this.props.perspectiveConfig.resultClasses[this.props.resultClass].heatmapIntensity && { intensity: this.props.perspectiveConfig.resultClasses[this.props.resultClass].heatmapIntensity }),
      getPosition: d => [+d.long, +d.lat],
      getWeight: d => +d.instanceCount
    })

  createHexagonLayer = data =>
    new HexagonLayer({
      id: 'hexagon-layer',
      data,
      extruded: true,
      radius: 2000,
      elevationScale: 100,
      getPosition: d => [+d.long, +d.lat]
    /* onHover: ({ object, x, y }) => {
      const tooltip = `${object.centroid.join(', ')}\nCount: ${object.points.length}`
    Update tooltip
       http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object

    } */
    })

    createPolygonLayer = data =>
      new PolygonLayer({
        id: 'polygon-layer',
        data,
        extruded: false,
        pickable: true,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.polygon,
        getFillColor: d => d.choroplethColor,
        getLineColor: [80, 80, 80],
        getLineWidth: 1
      })

    render () {
      const { classes, layerType, fetching, results, showTooltips, portalConfig } = this.props
      const { mapboxAccessToken, mapboxStyle } = portalConfig.mapboxConfig
      const { hoverInfo } = this.state
      const showTooltip = showTooltips && hoverInfo && hoverInfo.object
      const hasData = !fetching && results && results.length > 0 &&
      (
        (results[0].lat && results[0].long) ||
        (results[0].from && results[0].to) ||
        results[0].polygon
      )
      // console.log(hasData)

      /* It's OK to create a new Layer instance on every render
       https://github.com/uber/deck.gl/blob/master/docs/developer-guide/using-layers.md#should-i-be-creating-new-layers-on-every-render
      */
      let layer = null
      if (hasData) {
        switch (layerType) {
          case 'arcLayer':
            layer = this.createArcLayer(results)
            break
          case 'heatmapLayer':
            layer = this.createHeatmapLayer(results)
            break
          case 'hexagonLayer':
            layer = this.createHexagonLayer(results)
            break
          case 'polygonLayer':
            layer = this.createPolygonLayer(results)
            break
          default:
            layer = this.createHeatmapLayer(results)
            break
        }
      }
      return (
        <div className={classes.root}>
          <ReactMapGL
            {...this.state.viewport}
            width='100%'
            height='100%'
            reuseMaps
            mapStyle={`mapbox://styles/mapbox/${mapboxStyle}`}
            preventStyleDiffing
            mapboxApiAccessToken={mapboxAccessToken}
            onViewportChange={this.handleOnViewportChange}
          >
            <div className={classes.navigationContainer}>
              <NavigationControl />
              <FullscreenControl
                className={classes.fullscreenButton}
                container={document.querySelector('mapboxgl-map')}
              />
            </div>
            {layerType === 'arcLayer' &&
              <HTMLOverlay redraw={() =>
                <DeckArcLayerLegend
                  title={this.props.legendTitle}
                  fromText={this.props.legendFromText}
                  toText={this.props.legendToText}
                />}
              />}
            <DeckGL
              viewState={this.state.viewport}
              layers={[layer]}
              getCursor={() => 'initial'}
              {...(layerType === 'polygonLayer'
                ? {
                    getTooltip: ({ object }) => object && {
                      html: `
                      <h2>${object.prefLabel}</h2>
                      <div>${object.instanceCount}</div>
                    `
                    // style: {
                    //   backgroundColor: '#f00',
                    //   fontSize: '0.8em'
                    // }
                    }
                  }
                : {})
              }
            />
            {this.renderSpinner()}
            {layerType === 'arcLayer' && this.props.instanceAnalysisData && this.state.dialog.open &&
              <DeckArcLayerDialog
                onClose={this.closeDialog.bind(this)}
                data={this.props.instanceAnalysisData}
                from={this.state.dialog.from}
                to={this.state.dialog.to}
                fromText={this.props.fromText}
                toText={this.props.toText}
                countText={this.props.countText}
                listHeadingSingleInstance={this.props.listHeadingSingleInstance}
                listHeadingMultipleInstances={this.props.listHeadingMultipleInstances}
                instanceVariable={[this.props.instanceVariable]}
                resultClass={this.props.resultClass}
                facetClass={this.props.facetClass}
              />}
            {layerType === 'arcLayer' && showTooltip &&
              <DeckArcLayerTooltip
                data={hoverInfo}
                fromText={this.props.fromText}
                toText={this.props.toText}
                countText={this.props.countText}
                showMoreText={this.props.showMoreText}
              />}
          </ReactMapGL>
        </div>
      )
    }
}

Deck.propTypes = {
  classes: PropTypes.object.isRequired,
  results: PropTypes.array,
  layerType: PropTypes.oneOf(['arcLayer', 'heatmapLayer', 'hexagonLayer', 'polygonLayer']),
  tooltips: PropTypes.bool,
  facetUpdateID: PropTypes.number,
  fetchResults: PropTypes.func,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  fetching: PropTypes.bool.isRequired,
  legendComponent: PropTypes.element,
  fromText: PropTypes.string,
  toText: PropTypes.string,
  legendFromText: PropTypes.string,
  legendToText: PropTypes.string,
  legendTitle: PropTypes.string,
  showMoreText: PropTypes.string,
  listHeadingSingleInstance: PropTypes.string,
  listHeadingMultipleInstances: PropTypes.string,
  layoutConfig: PropTypes.object.isRequired
}

export const DeckComponent = Deck

export default withStyles(styles)(Deck)
