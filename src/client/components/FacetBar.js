import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
// import EnhancedTable from './EnhancedTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

import Typography from '@material-ui/core/Typography';
// import CheckboxesGroup from './CheckboxesGroup';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  headingContainer: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  facetContainer: {
    height: 350,
    marginBottom: theme.spacing.unit,
  },
  facetContainerLast: {
    height: 350,
    marginBottom: 2,
  },
  facetValuesContainer: {
    height: 288,
    padding: theme.spacing.unit,
  },
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

  //

  render() {
    const { classes, facet } = this.props;

    return (
      <div className={classes.root}>
        {this.props.facet.fetchingFacet ?
          <CircularProgress style={{ color: purple[500] }} thickness={5} /> :
          <React.Fragment>
            <Paper className={classes.facetContainer}>
              <Paper className={classes.headingContainer}>
                <Typography variant="h6">Title</Typography>
              </Paper>
              <div className={classes.facetValues}>

              </div>
            </Paper>
            <Paper className={classes.facetContainer}>
              <Paper className={classes.headingContainer}>
                <Typography variant="h6">Author</Typography>
              </Paper>
              <div className={classes.facetValues}>

              </div>
            </Paper>
            <Paper className={classes.facetContainerLast}>
              <Paper className={classes.headingContainer}>
                <Typography variant="h6">Production place</Typography>
              </Paper>
              <div className={classes.facetValuesContainer}>
                <Tree
                  data={facet.facetValues.productionPlace}
                  updateFilter={this.props.updateFilter}
                />
              </div>
            </Paper>
          </React.Fragment>
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
