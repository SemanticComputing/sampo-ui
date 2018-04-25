import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
// import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import ButtonAppBar from '../components/ButtonAppBar';
import IntegrationAutosuggest from '../components/IntegrationAutosuggest';
import LeafletMapContainer from '../components/LeafletMapContainer';
import { updateQuery, updateDatasets, fetchResults, clearResults } from '../actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

let FullWidthGrid = (props) => {
  const { classes } = props;
  // console.log("FullWidthGrid.js", props);

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <ButtonAppBar />
        </Grid>
        <Grid item xs={12} sm={3}>
          <IntegrationAutosuggest search={props.search} updateQuery={props.updateQuery}
            fetchResults={props.fetchResults} clearResults={props.clearResults} />
        </Grid>
        <Grid item xs={12} sm={9}>
          <LeafletMapContainer />
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  search: state.search,
});

const mapDispatchToProps = ({
  updateQuery,
  updateDatasets,
  fetchResults,
  clearResults,
});

FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  updateQuery: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
};

FullWidthGrid = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FullWidthGrid));

export default FullWidthGrid;
