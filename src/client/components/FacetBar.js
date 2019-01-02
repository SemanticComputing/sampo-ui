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

class FacetBar extends React.Component {

  render() {
    const { classes } = this.props;
    //console.log(this.props.productionPlace)
    return (
      <div className={classes.root}>
        <React.Fragment>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Source ({this.props.source.distinctValueCount})</Typography>
            </Paper>
            <div className={classes.facetValuesContainerThree}>
              <HierarchicalFacet
                key='source'
                property='source'
                data={this.props.source.values}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.source.isFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
              />
            </div>
          </Paper>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Author ({this.props.author.distinctValueCount})</Typography>
            </Paper>
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='author'
                property='author'
                data={this.props.author.values}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.author.isFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
              />
            </div>
          </Paper>
          <Paper className={classes.facetContainer}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Production place ({this.props.productionPlace.distinctValueCount})</Typography>
            </Paper>
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='productionPlace'
                property='productionPlace'
                data={this.props.productionPlace.values}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.productionPlace.isFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
              />
            </div>
          </Paper>
          { /*  <Paper className={classes.facetContainerLast}>
            <Paper className={classes.headingContainer}>
              <Typography variant="h6">Language</Typography>
            </Paper>
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='language'
                property='language'
                data={this.props.language}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.languageIsFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
              />
            </div>
          </Paper> */}
        </React.Fragment>
      </div>
    );
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facetFilters: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
  productionPlace: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  updatedFacet: PropTypes.string.isRequired,
};

export default withStyles(styles)(FacetBar);
