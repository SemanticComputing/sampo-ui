import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HierarchicalFacet from './HierarchicalFacet';
import TextFacet from './TextFacet';
import DateSlider from './slider/DateSlider';
import Paper from '@material-ui/core/Paper';
import FacetHeader from './FacetHeader';
import FacetInfo from './FacetInfo';

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
  one: {
    paddingLeft: theme.spacing.unit
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
  },

});

class FacetBar extends React.Component {

  renderFacet = (facetID, someFacetIsFetching) => {
    const { classes } = this.props;
    const { facetUpdateID, updatedFacet, updatedFilter, facets } = this.props.facetData;
    const facet = facets[facetID];
    let facetComponent = null;
    switch (facet.filterType) {
      case 'uriFilter':
      case 'spatialFilter':
        facetComponent = (
          <HierarchicalFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            updatedFacet={updatedFacet}
            updatedFilter={updatedFilter}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
          />
        );
        break;
      case 'textFilter':
        facetComponent = (
          <TextFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            updatedFacet={updatedFacet}
            updatedFilter={updatedFilter}
            fetchFacet={this.props.fetchFacet}
            someFacetIsFetching={someFacetIsFetching}
            updateFacetOption={this.props.updateFacetOption}
          />
        );
        break;
      case 'timespan':
        facetComponent = (
          <DateSlider />
        );
        break;
      default:
        facetComponent = (
          <HierarchicalFacet
            facetID={facetID}
            facet={facet}
            facetClass={this.props.facetClass}
            resultClass={this.props.resultClass}
            facetUpdateID={facetUpdateID}
            updatedFacet={updatedFacet}
            updatedFilter={updatedFilter}
            fetchFacet={this.props.fetchFacet}
            updateFacetOption={this.props.updateFacetOption}
          />
        );
        break;
    }
    return(
      <Paper key={facetID} className={classes.facetContainer}>
        <FacetHeader
          facetID={facetID}
          facet={facet}
          facetClass={this.props.facetClass}
          resultClass={this.props.resultClass}
          fetchFacet={this.props.fetchFacet}
          updateFacetOption={this.props.updateFacetOption}
        />
        <div className={classes[facet.containerClass]}>
          {facetComponent}
        </div>
      </Paper>
    );
  }

  render() {
    const { classes, facetClass, resultClass, resultCount } = this.props;
    const { facets } = this.props.facetData;
    let someFacetIsFetching = false;
    Object.values(facets).forEach(facet => {
      if (facet.isFetching) {
        someFacetIsFetching = true;
      }
    });

    return (
      <div className={classes.root}>
        <Paper className={classes.facetContainer}>
          <div className={classes.textContainer}>
            <FacetInfo
              facetUpdateID={this.props.facetData.facetUpdateID}
              facetData={this.props.facetData}
              facetClass={facetClass}
              resultClass={resultClass}
              resultCount={resultCount}
              fetchingResultCount={this.props.fetchingResultCount}
              updateFacetOption={this.props.updateFacetOption}
              fetchResultCount={this.props.fetchResultCount}
            />
          </div>
        </Paper>
        {Object.keys(facets).map(facetID => this.renderFacet(facetID, someFacetIsFetching))}
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
  fetchingResultCount: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchResultCount: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetBar);
