import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DeckGL from '@deck.gl/react'
import { ArcLayer } from '@deck.gl/layers'
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers'
import ReactMapGL, { NavigationControl, FullscreenControl, HTMLOverlay } from 'react-map-gl'
import MigrationsMapDialog from '../perspectives/mmm/MigrationsMapDialog'
import CircularProgress from '@material-ui/core/CircularProgress'
import { purple } from '@material-ui/core/colors'

/* Documentation links:
  https://deck.gl/#/documentation/getting-started/using-with-react?section=adding-a-base-map
  https://github.com/uber/deck.gl/blob/6.2-release/examples/website/arc/app.js
  http://deck.gl/#/documentation/deckgl-api-reference/layers/arc-layer
  https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
  https://www.mapbox.com/mapbox-gl-js/api#map
*/

const styles = theme => ({
  root: {
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
    marginTop: theme.spacing(1)
  }
})
class Deck extends React.Component {
  state = {
    viewport: {
      longitude: 10.37,
      latitude: 22.43,
      zoom: 2,
      pitch: 0,
      bearing: 0,
      width: 100,
      height: 100
    },
    dialog: {
      open: false,
      data: null
    }
  }

  componentDidMount = () => {
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      sortBy: null
    })
    this.setState({ mounted: true })
  }

  componentDidUpdate = prevProps => {
    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }
  }

  setDialog = info =>
    this.setState({
      dialog: {
        open: true,
        data: info.object
      }
    })

  closeDialog = () =>
    this.setState({
      dialog: {
        open: false,
        data: {}
      }
    })

  handleOnViewportChange = viewport =>
    this.state.mounted && this.setState({ viewport });

  renderSpinner () {
    if (this.props.fetching) {
      return (
        <div className={this.props.classes.spinner}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
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
      getWidth: 3,
      getSourceColor: [0, 0, 255, 255],
      getTargetColor: [255, 0, 0, 255],
      getSourcePosition: d => this.parseCoordinates(d.from),
      getTargetPosition: d => this.parseCoordinates(d.to),
      onClick: info => this.setDialog(info)
    })

  createHeatmapLayer = data =>
    new HeatmapLayer({
      id: 'heatmapLayer',
      data,
      radiusPixels: 40,
      threshold: 0.025,
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

  render () {
    const { classes, mapBoxAccessToken, mapBoxStyle, layerType, results } = this.props
    const hasData = results && results.length > 0

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
          mapStyle={`mapbox://styles/mapbox/${mapBoxStyle}`}
          preventStyleDiffing
          mapboxApiAccessToken={mapBoxAccessToken}
          onViewportChange={this.handleOnViewportChange}
        >
          <div className={classes.navigationContainer}>
            <NavigationControl />
            <FullscreenControl
              className={classes.fullscreenButton}
              container={document.querySelector('mapboxgl-map')}
            />
          </div>
          <HTMLOverlay redraw={() => this.props.legendComponent} />
          <DeckGL
            viewState={this.state.viewport}
            layers={[layer]}
          />
          {this.renderSpinner()}
          {layerType === 'arcLayer' &&
            <MigrationsMapDialog
              open={this.state.dialog.open}
              onClose={this.closeDialog.bind(this)}
              data={this.state.dialog.data}
            />}
        </ReactMapGL>
      </div>
    )
  }
}

Deck.propTypes = {
  classes: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  mapBoxAccessToken: PropTypes.string.isRequired,
  mapBoxStyle: PropTypes.string.isRequired,
  facetUpdateID: PropTypes.number,
  fetchResults: PropTypes.func,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  fetching: PropTypes.bool.isRequired,
  legendComponent: PropTypes.element
}

export default withStyles(styles)(Deck)
