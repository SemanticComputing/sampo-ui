import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import Paper from '@material-ui/core/Paper';
import Immutable from 'immutable';
import VirtualizedTable from '../components/VirtualizedTable';
import LeafletMap from '../components/map/LeafletMap';
import GMap from '../components/map/GMap';
import Pie from '../components/Pie';
import TopBar from '../components/TopBar';

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
  getGeoJSON,
  updateResultFormat,
  updateMapMode,
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
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    minWidth: 640,
    minHeight: 700
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 64,
    height: 'calc(100% - 128px)',
    borderRight: '4px solid' + theme.palette.primary.main,
    borderLeft: '4px solid' + theme.palette.primary.main,
  },
  resultTable: {
    width: 1024,
    height: 'calc(100% - 5px)',
    borderRight: '4px solid' + theme.palette.primary.main,

  },
  resultTableOneColumn: {
    width: 1024,
    height: 'calc(100% - 5px)',
  },
  rightColumn: {
    height: '100%',
    width: 'calc(100% - 1024px)',
  },
  map: {
    width: '100%',
    height: '50%',
    borderBottom: '4px solid' + theme.palette.primary.main,
  },
  statistics: {
    width: '100%',
    height: '50%',
  },
  footer: {
    position: 'absolute',
    borderTop: '4px solid' + theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    width: '100%',
    height: 64,
    background: theme.palette.primary.main,
    borderRadius: 0,
  },
  aaltoLogo: {
    //paddingLeft: 24,
    height: 37
  },
  uhLogo: {
    paddingLeft: 44,
    height: 52
  },
  secoLogo: {
    paddingLeft: 44,
    height: 52
  },
  heldigLogo: {
    paddingLeft: 44,
    height: 37
  },
  kotusLogo: {
    paddingLeft: 44,
    height: 50
  },
});

let MapApp = (props) => {
  const { classes,  mapMode, browser } = props;
  //error,

  let oneColumnView = true;
  if (browser.greaterThan.extraLarge) {
    oneColumnView = false;
  }

  let map = '';
  if (mapMode === 'heatMap') {
    map = (
      <GMap
        results={props.results}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKWw5FjhwLsfp_l2gjVAifPkT3cxGXhA4&v=3.exp&libraries=geometry,drawing,places,visualization"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  } else {
    map = (
      <LeafletMap
        sliderValue={100}
        results={props.results}
        geoJSON={props.geoJSON}
        geoJSONKey={props.geoJSONKey}
        getGeoJSON={props.getGeoJSON}
        mapMode={props.mapMode}
      />
    );
  }
  // map = '';

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <TopBar oneColumnView={oneColumnView} />
        <div className={classes.mainContainer}>
          <div className={oneColumnView ? classes.resultTableOneColumn : classes.resultTable}>
            <VirtualizedTable
              list={Immutable.List(props.results)}
              resultValues={props.resultValues}
              search={props.search}
              sortResults={props.sortResults}
              toggleDataset={props.toggleDataset}
              updateResultsFilter={props.updateResultsFilter}
              updateQuery={props.updateQuery}
              fetchResults={props.fetchResults}
              clearResults={props.clearResults}
              fetchSuggestions={props.fetchSuggestions}
              clearSuggestions={props.clearSuggestions}
            />
          </div>
          {!oneColumnView &&
            <div className={classes.rightColumn}>
              <div className={classes.map}>
                {map}
              </div>
              <div className={classes.statistics}>
                <Pie data={props.results} groupBy={props.search.groupBy} query={props.search.query} />
              </div>
            </div>
          }
        </div>
        <Paper className={classes.footer}>
          {/* <img className={classes.aaltoLogo} src='img/logos/aalto-logo-white-no-background-small.png' alt='Aalto University logo'/> */}
          <img className={classes.uhLogo} src='img/logos/university-of-helsinki-logo-white-no-background-small.png' alt='University of Helsinki logo'/>
          {/* <img className={classes.secoLogo} src='img/logos/seco-logo-white-no-background-small.png' alt='SeCo logo'/> */}
          <img className={classes.heldigLogo} src='img/logos/heldig-logo-small.png' alt='HELDIG logo'/>
          <img className={classes.kotusLogo} src='img/logos/kotus-logo-white-no-backgrounds-small.png' alt='Kotus logo'/>
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    search: state.search,
    results: getVisibleResults(state.search),
    resultValues: getVisibleValues(state.search),
    mapMode: state.options.mapMode,
    error: state.error,
    geoJSON: state.map.geoJSON,
    geoJSONKey: state.map.geoJSONKey,
    resultFormat: state.options.resultFormat,
    browser: state.browser
  };
};

const mapDispatchToProps = ({
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  sortResults,
  getGeoJSON,
  updateResultFormat,
  updateMapMode,
  updateResultsFilter
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
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
  mapMode: PropTypes.string.isRequired,
  results: PropTypes.array,
  resultValues: PropTypes.object,
  updateResultsFilter: PropTypes.func.isRequired,
  browser: PropTypes.object.isRequired
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withWidth(),
  withStyles(styles, {withTheme: true}),
)(MapApp);
