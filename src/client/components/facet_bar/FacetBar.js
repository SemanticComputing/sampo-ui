import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import DateSlider from './slider/DateSlider';
import Paper from '@material-ui/core/Paper';
import FacetHeader from './FacetHeader';
import Typography from '@material-ui/core/Typography';
import ActiveFilters from './ActiveFilters';

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
  four: {
    height: 135,
    padding: theme.spacing.unit,
  },
  five: {
    height: 150,
    padding: theme.spacing.unit,
  },
  ten: {
    height: 350,
    padding: theme.spacing.unit,
  },
  facetHeaderButtons: {
    marginLeft: 'auto'
  },
  textContainer: {
    padding: theme.spacing.unit
  }
});

class FacetBar extends React.Component {

  render() {
    const { classes, facetClass } = this.props;
    const { facetUpdateID, updatedFacet, facets } = this.props.facetData;
    let uriFilters = {};
    let spatialFilters = {};
    let activeUriFilters = false;
    let activeSpatialFilters = false;
    for (const [key, value] of Object.entries(facets)) {
      if (value.uriFilter !== null) {
        activeUriFilters = true;
        uriFilters[key] = value.uriFilter;
      } else if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
        activeSpatialFilters = true;
        spatialFilters[key] = value.spatialFilter._bounds;
      }
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.facetContainer}>
          <div className={classes.textContainer}>
            <Typography variant="h6">{this.props.resultCount} {this.props.resultClass}</Typography>
          </div>
        </Paper>
        {(activeUriFilters || activeSpatialFilters) &&
          <Paper className={classes.facetContainer}>
            <FacetHeader
              facet={{ label: 'Active filters'}}
            />
            <div className={classes.textContainer}>
              <ActiveFilters
                facets={facets}
                facetClass={facetClass}
                uriFilters={uriFilters}
                spatialFilters={spatialFilters}
                updateFacetOption={this.props.updateFacetOption}
              />
            </div>
          </Paper>
        }
        <Paper className={classes.facetContainer}>
          <div className={classes.textContainer}>
            <Typography variant="h6">Narrow down by:</Typography>
          </div>
        </Paper>
        {Object.keys(facets).map(id => {
          return (
            <Paper key={id} className={classes.facetContainer}>
              <FacetHeader
                facetID={id}
                facet={facets[id]}
                facetClass={this.props.facetClass}
                resultClass={this.props.resultClass}
                fetchFacet={this.props.fetchFacet}
                updateFacetOption={this.props.updateFacetOption}
              />
              <div className={classes[facets[id].containerClass]}>
                {facets[id].filterType === 'uriFilter' || facets[id].filterType === 'spatialFilter' ?
                  <Tree
                    facetID={id}
                    facet={facets[id]}
                    facetClass={this.props.facetClass}
                    resultClass={this.props.resultClass}
                    facetUpdateID={facetUpdateID}
                    updatedFacet={updatedFacet}
                    fetchFacet={this.props.fetchFacet}
                    updateFacetOption={this.props.updateFacetOption}
                  /> :
                  <DateSlider
                    facetID={id}
                    facet={facets[id]}
                    facetClass={this.props.facetClass}
                    resultClass={this.props.resultClass}
                    facetUpdateID={facetUpdateID}
                    updatedFacet={updatedFacet}
                    fetchFacet={this.props.fetchFacet}
                    updateFacetOption={this.props.updateFacetOption}
                  />
                }
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
  resultClass: PropTypes.string.isRequired,
  resultCount: PropTypes.number.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetBar);
