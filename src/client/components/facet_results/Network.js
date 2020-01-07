import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cytoscape from 'cytoscape';

const styles = theme => ({
  root: {
    height: 400,
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    }
  },
  cyContainer: {
    width: '100%',
    height: '100%'
  }
});

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
  numIter: 1000,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
};

//const layout = { name: 'concentric' };


class Network extends React.Component {
  constructor(props) {
    super(props);
    this.cyRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
    });
    this.cy = cytoscape({
      container: this.cyRef.current,

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': ele => ele.data('class') === 'http://erlangen-crm.org/efrbroo/F4_Manifestation_Singleton'
              ? '#666' : '#000',
            'label': 'data(prefLabel)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ]
    });
  }

  componentDidUpdate = () => {
    if (this.props.results !== null) {
      console.log(this.props.results.elements)
      this.cy.add(this.props.results.elements);
      this.cy.layout(layout).run();
    }
  }

  render = () => {
    return (
      <React.Fragment>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.cyContainer} ref={this.cyRef} />
        </div>
      </React.Fragment>
    );
  }
}

Network.propTypes = {
  classes: PropTypes.object.isRequired,
  results: PropTypes.object,
  fetchResults: PropTypes.func.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
};

export default withStyles(styles)(Network);
