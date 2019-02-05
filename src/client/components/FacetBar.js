import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HierarchicalFacet from './HierarchicalFacet';
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
  facetValuesContainerTen: {
    height: 345,
    padding: theme.spacing.unit,
  },
  facetValuesContainerThree: {
    height: 108,
    padding: theme.spacing.unit,
  },
  facetHeaderButtons: {
    marginLeft: 'auto'
  }
});

class FacetBar extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>

        {this.props.source &&
          <Paper className={classes.facetContainer}>
            <FacetHeader
              label='Source'
              property='source'
              hierarchical={false}
              distinctValueCount={this.props.source.distinctValueCount}
              sortBy={this.props.source.sortBy}
              sortDirection={this.props.source.sortDirection}
              fetchFacet={this.props.fetchFacet}
            />
            <div className={classes.facetValuesContainerThree}>
              <HierarchicalFacet
                key='source'
                property='source'
                data={this.props.source.values}
                sortBy={this.props.source.sortBy}
                sortDirection={this.props.source.sortDirection}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.source.isFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
                searchField={false}
              />
            </div>
          </Paper>
        }

        {this.props.author &&
          <Paper className={classes.facetContainer}>
            <FacetHeader
              label='Author'
              property='author'
              hierarchical={false}
              distinctValueCount={this.props.author.distinctValueCount}
              sortBy={this.props.author.sortBy}
              sortDirection={this.props.author.sortDirection}
              fetchFacet={this.props.fetchFacet}
            />
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='author'
                property='author'
                data={this.props.author.values}
                sortBy={this.props.author.sortBy}
                sortDirection={this.props.author.sortDirection}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.author.isFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
                searchField={true}
              />
            </div>
          </Paper>
        }

        {this.props.productionPlace &&
          <Paper className={classes.facetContainerLast}>
            <FacetHeader
              label='Production place'
              property='productionPlace'
              hierarchical={true}
              distinctValueCount={this.props.productionPlace.distinctValueCount}
              sortBy={this.props.productionPlace.sortBy}
              sortDirection={this.props.productionPlace.sortDirection}
              fetchFacet={this.props.fetchFacet}
            />
            <div className={classes.facetValuesContainerTen}>
              <HierarchicalFacet
                key='productionPlace'
                property='productionPlace'
                data={this.props.productionPlace.values}
                sortBy={this.props.productionPlace.sortBy}
                sortDirection={this.props.productionPlace.sortDirection}
                fetchFacet={this.props.fetchFacet}
                fetchingFacet={this.props.productionPlace.isFetching}
                facetFilters={this.props.facetFilters}
                updateFilter={this.props.updateFilter}
                updatedFacet={this.props.updatedFacet}
                searchField={true}
              />
            </div>
          </Paper>
        }

        {/*<Paper className={classes.facetContainerLast}>
          <Paper className={classes.headingContainer}>
            <Typography variant="h6">Language</Typography>
            <div className={classes.facetHeaderButtons}>
              <IconButton disabled aria-label="Statistics">
                <PieChart />
              </IconButton>
              <IconButton disabled aria-label="Expand">
                <ExpandLess />
              </IconButton>
            </div>
          </Paper>
          <div className={classes.facetValuesContainerTen}>
            <HierarchicalFacet
              key='language'
              property='language'
              data={this.props.language.values}
              sortBy={this.props.language.sortBy}
              fetchFacet={this.props.fetchFacet}
              fetchingFacet={this.props.language.isFetching}
              facetFilters={this.props.facetFilters}
              updateFilter={this.props.updateFilter}
              updatedFacet={this.props.updatedFacet}
              searchField={true}
            />
          </div>
        </Paper> */}

      </div>
    );
  }
}

FacetBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facetFilters: PropTypes.object.isRequired,
  source: PropTypes.object,
  productionPlace: PropTypes.object,
  author: PropTypes.object,
  language: PropTypes.object,
  updateFilter: PropTypes.func.isRequired,
  updatedFacet: PropTypes.string.isRequired,
};

export default withStyles(styles)(FacetBar);
