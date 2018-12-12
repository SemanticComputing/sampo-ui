import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
// import EnhancedTable from './EnhancedTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import Paper from '@material-ui/core/Paper';
//import Typography from '@material-ui/core/Typography';
// import CheckboxesGroup from './CheckboxesGroup';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  facetContainer: {
    height: 350,
    borderBottom: '4px solid' + theme.palette.primary.main,
  }
});

class FacetBar extends React.Component {

  componentDidMount = () => {
    this.props.fetchFacet();
  }

  // componentDidUpdate = prevProps => {
  //   if (prevProps.facet.facetFilters != this.props.facet.facetFilters) {
  //     this.props.fetchFacet();
  //   }
  // }

  render() {
    const { classes, facet } = this.props;

    return (
      <div className={classes.root}>
        {this.props.facet.fetchingFacet ?
          <CircularProgress style={{ color: purple[500] }} thickness={5} /> :
          <Paper className={classes.facetContainer}>
            <Tree
              data={facet.facetValues.productionPlace}
              updateFilter={this.props.updateFilter}
            />
          </Paper>
        }
      </div>
    );
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(FacetBar);
