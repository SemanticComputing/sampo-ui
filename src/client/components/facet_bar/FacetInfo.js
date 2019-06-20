import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import ActiveFilters from './ActiveFilters';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

const styles = theme => ({
  facetInfoDivider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
  }
});

class FacetInfo extends React.Component {

  componentDidMount = () => {
    this.props.fetchResultCount({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResultCount({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
      });
    }
  }

  render() {
    const { classes, facetClass, resultClass, resultCount } = this.props;
    const { facets } = this.props.facetData;
    let uriFilters = {};
    let spatialFilters = {};
    let textFilters = {};
    let timespanFilters = {};
    let activeUriFilters = false;
    let activeSpatialFilters = false;
    let activeTextFilters = false;
    let activeTimespanFilters = false;
    for (const [key, value] of Object.entries(facets)) {
      if (has(value, 'uriFilter') && value.uriFilter !== null) {
        activeUriFilters = true;
        uriFilters[key] = value.uriFilter;
      }
      if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
        activeSpatialFilters = true;
        spatialFilters[key] = value.spatialFilter._bounds;
      }
      if (has(value, 'textFilter') && value.textFilter !== null) {
        activeTextFilters = true;
        textFilters[key] = value.textFilter;
      }
      if (has(value, 'timespanFilter') && value.timespanFilter !== null) {
        activeTimespanFilters = true;
        timespanFilters[key] = value.timespanFilter;
      }
    }
    return (
      <div className={classes.root}>
        { this.props.fetchingResultCount ?
          <CircularProgress
            style={{ color: purple[500] }}
            thickness={5}
            size={26}
          />
          :
          <Typography variant="h6">Results: {resultCount} {resultClass}</Typography>
        }
        <Divider className={classes.facetInfoDivider} />
        {(activeUriFilters
          || activeSpatialFilters
          || activeTextFilters
          || activeTimespanFilters
        ) &&
          <React.Fragment>
            <Typography variant="h6">Active filters:</Typography>
            <div className={classes.textContainer}>
              <ActiveFilters
                facets={facets}
                facetClass={facetClass}
                uriFilters={uriFilters}
                spatialFilters={spatialFilters}
                textFilters={textFilters}
                timespanFilters={timespanFilters}
                updateFacetOption={this.props.updateFacetOption}
              />
            </div>
            <Divider className={classes.facetInfoDivider} />
          </React.Fragment>
        }
        <Typography variant="h6">Narrow down by:</Typography>
      </div>
    );
  }
}

FacetInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  facetUpdateID: PropTypes.number.isRequired,
  facetData: PropTypes.object.isRequired,
  facetClass: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  resultCount: PropTypes.number.isRequired,
  fetchingResultCount: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  fetchResultCount: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetInfo);
