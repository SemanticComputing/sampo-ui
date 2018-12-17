import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
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

  componentDidMount = () => {
    this.props.fetchFacet('source');
  }

  componentDidUpdate = prevProps => {
    if (prevProps.facetFilters != this.props.facetFilters) {
      this.props.fetchFacet('source');
    }
  }

  //

  render() {
    const { classes, source, productionPlace, lastUpdatedFacet } = this.props;
    //console.log(source)
    return (
      <div className={classes.root}>
        {this.props.fetchingFacet ?
          <CircularProgress style={{ color: purple[500] }} thickness={5} /> :
          <React.Fragment>
            <Paper className={classes.facetContainer}>
              <Paper className={classes.headingContainer}>
                <Typography variant="h6">Source</Typography>
              </Paper>
              <div className={classes.facetValuesContainerThree}>
                <Tree
                  key='source'
                  property='source'
                  lastUpdatedFacet={lastUpdatedFacet}
                  data={source}
                  fetchFacet={this.props.fetchFacet}
                  updateFilter={this.props.updateFilter}
                />
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
              <div className={classes.facetValues}>

              </div>
            </Paper>
            <Paper className={classes.facetContainer}>
              <Paper className={classes.headingContainer}>
                <Typography variant="h6">Production place</Typography>
              </Paper>
              { /* <div className={classes.facetValuesContainerTen}>
                <Tree
                  key='productionPlace'
                  property='productionPlace'
                  lastUpdatedFacet={lastUpdatedFacet}
                  data={productionPlace}
                  fetchFacet={this.props.fetchFacet}
                  updateFilter={this.props.updateFilter}
                />
              </div>
              */ }
            </Paper>
            <Paper className={classes.facetContainerLast}>
              <Paper className={classes.headingContainer}>
                <Typography variant="h6">Production date</Typography>
              </Paper>
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
  fetchingFacet: PropTypes.bool.isRequired,
  lastUpdatedFacet: PropTypes.string.isRequired,
  facetFilters: PropTypes.object.isRequired,
  source: PropTypes.array.isRequired,
  productionPlace: PropTypes.array.isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(FacetBar);
