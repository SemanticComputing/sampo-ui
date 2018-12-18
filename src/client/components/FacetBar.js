import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HierarchicalFacet from './HierarchicalFacet';
import Typography from '@material-ui/core/Typography';
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
    marginBottom: theme.spacing.unit,
  },
  facetContainerLast: {
    marginBottom: 2,
  },
  facetValuesContainerTen: {
    height: 295,
    padding: theme.spacing.unit,
  },
  facetValuesContainerThree: {
    height: 108,
    padding: theme.spacing.unit,
  },
});

// <HierarchicalFacet
//   key='source'
//   property='source'
//   data={this.props.source}
//   fetchFacet={this.props.fetchFacet}
//   facetFilters={this.props.facetFilters}
//   updateFilter={this.props.updateFilter}
//   updatedFacet={this.props.updatedFacet}
// />

class FacetBar extends React.Component {

  render() {
    const { classes } = this.props;
    //console.log(this.props.productionPlace)
    return (
      <div className={classes.root}>
        <React.Fragment>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Source</Typography>
            </Paper>
            <div className={classes.facetValuesContainerThree}>

            </div>
          </Paper>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Work</Typography>
            </Paper>
          </Paper>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Author</Typography>
            </Paper>
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='author'
                property='author'
                data={this.props.author}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.authorIsFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
              />
            </div>
          </Paper>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Production place</Typography>
            </Paper>
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='productionPlace'
                property='productionPlace'
                data={this.props.productionPlace}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.productionPlaceIsFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
              />
            </div>
          </Paper>
          <Paper className={classes.facetContainerLast}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Production date</Typography>
            </Paper>
          </Paper>
        </React.Fragment>
      </div>
    );
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facetFilters: PropTypes.object.isRequired,
  source: PropTypes.array.isRequired,
  productionPlace: PropTypes.array.isRequired,
  author: PropTypes.array.isRequired,
  sourceIsFetching: PropTypes.bool.isRequired,
  authorIsFetching: PropTypes.bool.isRequired,
  productionPlaceIsFetching: PropTypes.bool.isRequired,
  updateFilter: PropTypes.func.isRequired,
  updatedFacet: PropTypes.string.isRequired,
};

export default withStyles(styles)(FacetBar);
