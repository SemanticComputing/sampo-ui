import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Immutable from 'immutable';
import IntegrationAutosuggest from '../components/IntegrationAutosuggest';
import VirtualizedTable from '../components/VirtualizedTable';
import DatasetSelector from '../components/DatasetSelector';
import LeafletMap from '../components/map/LeafletMap';

import {
  getVisibleResults,
  getVisibleValues
} from '../selectors';

import {
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  openAnalysisView,
  closeAnalysisView,
  getGeoJSON,
  updateResultFormat,
  updateResultsFilter,
  sortResults,
} from '../actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  mainContainer: {
    marginTop: 64,
    height: 'calc(100% - 64px)'
  }
});

let MapApp = (props) => {
  const { classes, error, analysisView } = props;
  console.log(props.results);

  let resultsSection = '';
  if (props.results.length > 0) {
    resultsSection = (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Select data sources</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <DatasetSelector
              datasets={props.search.datasets}
              toggleDataset={props.toggleDataset}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <IntegrationAutosuggest
          search={props.search}
          updateQuery={props.updateQuery}
          fetchSuggestions={props.fetchSuggestions}
          clearSuggestions={props.clearSuggestions}
          fetchResults={props.fetchResults}
          clearResults={props.clearResults}
          updateResultFormat={props.updateResultFormat}
        />
        <VirtualizedTable
          list={Immutable.List(props.results)}
          resultValues={props.resultValues}
          search={props.search}
          sortResults={props.sortResults}
          updateResultsFilter={props.updateResultsFilter} />
      </div>
    );
    //resultsView = <Pie data={props.results} query={props.search.query} />;
  }

  const map = (
    <LeafletMap
      sliderValue={100}
      results={props.results}
      geoJSON={props.geoJSON}
      geoJSONKey={props.geoJSONKey}
      getGeoJSON={props.getGeoJSON}
    />
  );

  let smallView = analysisView ? map : resultsSection;
  let mainView = analysisView ? resultsSection : map ;



  //
  //     <ExpansionPanel>
  //       <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
  //         <Typography className={classes.heading}>Saved searches</Typography>
  //       </ExpansionPanelSummary>
  //       <ExpansionPanelDetails>
  //         <Typography>
  //           Saved searches go here
  //         </Typography>
  //       </ExpansionPanelDetails>
  //     </ExpansionPanel>
  //     {smallView}
  //   </Drawer>
  // );

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar position="absolute">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Hipla.fi
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.mainContainer}>
          <Grid item xs={12} sm={4}>
            {smallView}
          </Grid>
          <Grid item xs={12} sm={8}>
            {mainView}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  // console.log('mapping state to props ', getVisibleResults(state.search))
  return {
    search: state.search,
    results: getVisibleResults(state.search),
    resultValues: getVisibleValues(state.search),
    analysisView: state.options.analysisView,
    error: state.error,
    geoJSON: state.map.geoJSON,
    geoJSONKey: state.map.geoJSONKey,
    resultFormat: state.options.resultFormat
  };
};

const mapDispatchToProps = ({
  openAnalysisView,
  closeAnalysisView,
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  sortResults,
  getGeoJSON,
  updateResultFormat,
  updateResultsFilter
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  analysisView: PropTypes.bool.isRequired,
  openAnalysisView: PropTypes.func.isRequired,
  closeAnalysisView: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  toggleDataset: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  geoJSON: PropTypes.object.isRequired,
  geoJSONKey: PropTypes.number,
  getGeoJSON: PropTypes.func.isRequired,
  updateResultFormat: PropTypes.func.isRequired,
  resultFormat: PropTypes.string.isRequired,
  results: PropTypes.array,
  resultValues: PropTypes.object,
  updateResultsFilter: PropTypes.func.isRequired
};

MapApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(MapApp));

export default MapApp;
