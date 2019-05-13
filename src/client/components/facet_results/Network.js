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

class Network extends React.Component {
  constructor(props) {
    super(props);
    this.cyRef = React.createRef();
  }

  componentDidMount = () => {
    this.cy = cytoscape({
      container: this.cyRef.current
    });
    this.cy.add([
      { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
      { group: 'nodes', data: { id: 'n1' }, position: { x: 200, y: 200 } },
      { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
    ]);
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Network);
