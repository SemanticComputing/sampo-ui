import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import DateSlider from './slider/DateSlider';
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
  }
});

class FacetBar extends React.Component {

  render() {
    const { classes } = this.props;
    const { facetUpdateID, updatedFacet, facets } = this.props.facetData;
    return (
      <div className={classes.root}>
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
  fetchFacet: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetBar);
