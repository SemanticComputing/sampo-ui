import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import Paper from '@material-ui/core/Paper';
import FacetHeader from './FacetHeader';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  headingContainer: {
    display: 'flex',
    alignItems: 'center',
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
  three: {
    height: 108,
    padding: theme.spacing.unit,
  },
  five: {
    height: 150,
    padding: theme.spacing.unit,
  },
  ten: {
    height: 345,
    padding: theme.spacing.unit,
  },
  facetHeaderButtons: {
    marginLeft: 'auto'
  }
});

class FacetBar extends React.Component {

  render() {
    const { classes } = this.props;
    const { facets, filters, updatedFacet } = this.props.facetData;
    return (
      <div className={classes.root}>
        {Object.keys(facets).map(id => {
          return (
            <Paper key={id} className={classes.facetContainer}>
              <FacetHeader
                label={facets[id].label}
                property={id}
                hierarchical={false}
                distinctValueCount={facets[id].distinctValueCount}
                sortBy={facets[id].sortBy}
                sortDirection={facets[id].sortDirection}
                sortButton={facets[id].sortButton}
                fetchFacet={this.props.fetchFacet}
              />
              <div className={classes[facets[id].containerClass]}>
                <Tree
                  facetFunctionality={true}
                  property={id}
                  data={facets[id].values}
                  facetClass={this.props.facetClass}
                  sortBy={facets[id].sortBy}
                  sortDirection={facets[id].sortDirection}
                  fetchFacet={this.props.fetchFacet}
                  fetchingFacet={facets[id].isFetching}
                  facetFilters={filters}
                  updateFilter={this.props.updateFilter}
                  updatedFacet={updatedFacet}
                  searchField={facets[id].searchField}
                />
              </div>
            </Paper>
          );
        })}
      </div>
    );
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetBar);
