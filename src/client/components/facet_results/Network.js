import React from 'react'
import PropTypes from 'prop-types'
import history from '../../History'
import cytoscape from 'cytoscape'
import panzoom from 'cytoscape-panzoom'
import 'cytoscape-panzoom/cytoscape.js-panzoom.css'
import CircularProgress from '@mui/material/CircularProgress'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faMinus, faPlus, faExpand } from '@fortawesome/free-solid-svg-icons'
import { purple } from '@mui/material/colors';

const zoomControlOptions = {
  zoomFactor: 0.05, // zoom factor per zoom tick
  zoomDelay: 45, // how many ms between zoom ticks
  minZoom: 0.1, // min zoom level
  maxZoom: 10, // max zoom level
  fitPadding: 50, // padding when fitting
  panSpeed: 10, // how many ms in between pan ticks
  panDistance: 10, // max pan distance per tick
  panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
  panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
  panInactiveArea: 8, // radius of inactive area in pan drag box
  panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
  zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
  fitSelector: undefined, // selector of elements to fit
  animateOnFit: function () { // whether to animate on fit
    return false
  },
  fitAnimationDuration: 1000, // duration of animation on fit

  // icon class names
  sliderHandleIcon: 'fas fa-minus',
  zoomInIcon: 'fas fa-plus',
  zoomOutIcon: 'fas fa-minus',
  resetIcon: 'fas fa-expand'
}

const cyContainerStyle = {
  width: '100%',
  height: '100%'
}

class Network extends React.Component {
  constructor (props) {
    super(props)
    this.cyRef = React.createRef()
  }

  componentDidMount = () => {
    this.props.fetchResults({
      perspectiveID: this.props.perspectiveConfig.id,
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      uri: this.props.uri,
      limit: this.props.limit,
      optimize: this.props.optimize
    })

    this.cy = cytoscape({
      container: this.cyRef.current,
      style: this.props.style
    })

    this.cy.on('tap', 'node', function () {
      try {
        if (this.data('href')) {
          history.push(this.data('href'))
        }
      } catch (e) { // fall back on url change
        console.log('Fail', e)
        console.log(this.data())
      }
    })

    this.cy.on('mouseover', 'node', function (event) {
      const node = event.target
      if (node.data('href')) {
        document.body.style.cursor = 'pointer'
      }
      /** // possibility to change node appearance
      node.style({
        'background-color': '#F00'}
        )
      */
    })

    this.cy.on('mouseout', 'node', function (event) {
      document.body.style.cursor = 'default'
    })

    if (this.cy.panzoom == null) {
      // register panzoom extension
      panzoom(cytoscape)
    }
    // add the panzoom control
    this.cy.panzoom(zoomControlOptions)

    // https://www.pullrequest.com/blog/webpack-fontawesome-guide/
    library.add(faMinus, faPlus, faExpand)
    dom.watch({ observeMutationsRoot: document.getElementById('cytoscape-container') })
  }

  componentDidUpdate = prevProps => {
    // Render the chart again if the raw data has changed
    if (prevProps.resultUpdateID !== this.props.resultUpdateID ||
      (prevProps.fetching && !this.props.fetching)) {
      this.renderCytocape()
    }
    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass
      })
    }
  }

  renderCytocape = () => {
    this.cy.elements().remove()
    this.cy.resize() // this fixes panning issues on a faceted search perspective
    if (this.props.preprocess) {
      this.props.preprocess(this.props.results.elements)
    }
    this.cy.add(this.props.results.elements)
    if (this.props.layout) {
      this.cy.layout(this.props.layout).run()
    }
    if (this.props.fitLayout) {
      this.cy.fit()
    }
  }

  render = () => {
    const { fetching, pageType, layoutConfig } = this.props
    const rootStyle = {
      width: '100%',
      backgroundColor: '#fff',
      borderTop: '1px solid rgba(224, 224, 224, 1)'
    }
    if (pageType === 'instancePage') {
      rootStyle.height = 'calc(100% - 1px)'
    }
    if (pageType === 'facetResults') {
      rootStyle.height = `calc(100% - ${layoutConfig.tabHeight + 1}px)`
    }
    const spinnerContainerStyle = {
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }
    return (
      <div style={rootStyle}>
        {fetching &&
          <div style={spinnerContainerStyle}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>}
        <div id='cytoscape-container' style={cyContainerStyle} ref={this.cyRef} />
      </div>
    )
  }
}

Network.propTypes = {
  results: PropTypes.object,
  fetchResults: PropTypes.func,
  fetchNetworkById: PropTypes.func,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string,
  facetUpdateID: PropTypes.number,
  resultUpdateID: PropTypes.number.isRequired,
  uri: PropTypes.string,
  limit: PropTypes.number.isRequired,
  optimize: PropTypes.number.isRequired,
  style: PropTypes.array.isRequired,
  layout: PropTypes.object,
  preprocess: PropTypes.func,
  fetching: PropTypes.bool,
  fitLayout: PropTypes.bool,
  layoutConfig: PropTypes.object.isRequired
}

export default Network
