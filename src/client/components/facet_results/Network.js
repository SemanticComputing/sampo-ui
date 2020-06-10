import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import history from '../../History'
import cytoscape from 'cytoscape'

const styles = theme => ({
  root: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 21px)'
    }
  },
  cyContainer: {
    width: '100%',
    height: '100%'
  }
})

const layout = {
  name: 'cose',
  idealEdgeLength: 100,
  nodeOverlap: 20,
  refresh: 20,
  fit: true,
  padding: 30,
  randomize: false,
  componentSpacing: 100,
  nodeRepulsion: 400000,
  edgeElasticity: 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1347,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
}

class Network extends React.Component {
  constructor (props) {
    super(props)
    this.cyRef = React.createRef()
  }

  componentDidMount = () => {
    if (this.props.pageType === 'instancePage') {
      this.props.fetchNetworkById({
        resultClass: this.props.resultClass,
        id: this.props.id,
        limit: this.props.limit,
        optimize: this.props.optimize
      })
    } else {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        limit: this.props.limit,
        optimize: this.props.optimize
      })
    }
    this.cy = cytoscape({
      container: this.cyRef.current,

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            shape: 'ellipse',
            'font-size': '12',
            'background-color': ele => ele.data('color') || '#666',
            label: ' data(prefLabel)',
            height: ele => (ele.data('size') || 16 / (ele.data('distance') + 1) || '16px'),
            width: ele => (ele.data('size') || 16 / (ele.data('distance') + 1) || '16px')
          }
        },
        {
          selector: 'edge',
          style: {
            width: ele => ele.data('weight') || 1,
            'line-color': ele => ele.data('color') || '#BBB',
            'curve-style': 'bezier',
            content: ' data(prefLabel) ',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#999',
            color: '#555',
            'font-size': '6',
            'text-valign': 'top',
            'text-halign': 'center',
            'edge-text-rotation': 'autorotate',
            'text-background-opacity': 1,
            'text-background-color': 'white',
            'text-background-shape': 'roundrectangle'
          }
        }
      ]
    })

    this.cy.on('tap', 'node', function () {
      try {
        if (this.data('href')) {
          // console.log(this.data('href'))
          history.push(this.data('href'))
        }
      } catch (e) { // fall back on url change
        console.log('Fail', e)
        console.log(this.data())
      }
    })
  }

  componentDidUpdate = prevProps => {
    if (prevProps.resultUpdateID !== this.props.resultUpdateID) {
      // console.log(this.props.results.elements);
      this.cy.elements().remove()
      this.cy.add(this.props.results.elements)
      this.cy.layout(layout).run()
    }
    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass
      })
    }
  }

  render = () => {
    return (
      <div className={this.props.classes.root}>
        <div className={this.props.classes.cyContainer} ref={this.cyRef} />
      </div>
    )
  }
}

Network.propTypes = {
  classes: PropTypes.object.isRequired,
  results: PropTypes.object,
  fetchResults: PropTypes.func,
  fetchNetworkById: PropTypes.func,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string,
  facetUpdateID: PropTypes.number,
  resultUpdateID: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  optimize: PropTypes.number.isRequired
}

export default withStyles(styles)(Network)
