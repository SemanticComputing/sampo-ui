import React from 'react'
import PropTypes from 'prop-types'
import history from '../../History'
import cytoscape from 'cytoscape'
import purple from '@material-ui/core/colors/purple'
import CircularProgress from '@material-ui/core/CircularProgress'

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
    const { fetching, pageType } = this.props
    const rootStyle = {
      width: '100%',
      backgroundColor: '#fff',
      borderTop: '1px solid rgba(224, 224, 224, 1)'
    }
    if (pageType === 'instancePage') {
      rootStyle.height = 'calc(100% - 1px)'
    }
    if (pageType === 'facetResults') {
      rootStyle.height = 'calc(100% - 72px)'
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
        <div style={cyContainerStyle} ref={this.cyRef} />
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
  fitLayout: PropTypes.bool
}

export default Network
