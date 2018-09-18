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
  //getVisibleResults,
  getVisibleValues
} from '../selectors';

import {
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchManuscripts,
  fetchPlaces,
  clearManuscripts,
  clearPlaces,
  getGeoJSON,
  updateResultFormat,
  updateMapMode,
  updateResultsFilter,
  sortResults,
  bounceMarker,
  openMarkerPopup,
  removeTempMarker
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
  fullMap: {
    width: '100%',
    height: '100%',
  },
  statistics: {
    width: '100%',
    height: '50%',
  },
  statisticsOneColumn: {
    width: '100%',
    height: '100%',
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
  const { classes, options, browser, search, map, manuscripts, creationPlaces, resultValues } = props;
  //error,

  let oneColumnView = browser.lessThan.extraLarge;

  // console.log('oneColumnView', oneColumnView)
  // console.log('resultFormat', resultFormat)
  // console.log('mapMode', mapMode)
  //console.log(props.results)
  console.log(manuscripts)

  let table = '';
  if ((oneColumnView && options.resultFormat === 'table') || (!oneColumnView)) {
    table = (
      <div className={oneColumnView ? classes.resultTableOneColumn : classes.resultTable}>
        <VirtualizedTable
          list={Immutable.List(manuscripts)}
          resultValues={resultValues}
          search={search}
          sortResults={props.sortResults}
          updateResultsFilter={props.updateResultsFilter}
          updateQuery={props.updateQuery}
          fetchManuscripts={props.fetchManuscripts}
          clearManuscripts={props.clearManuscripts}
          fetchPlaces={props.fetchPlaces}
          clearPlaces={props.clearPlaces}
          fetchSuggestions={props.fetchSuggestions}
          clearSuggestions={props.clearSuggestions}
          bounceMarker={props.bounceMarker}
          openMarkerPopup={props.openMarkerPopup}
          removeTempMarker={props.removeTempMarker}
        />
      </div>
    );
  }

  let mapElement = '';
  if ((oneColumnView && options.resultFormat === 'map') || (!oneColumnView)) {
    if (options.mapMode === 'heatmap') {
      mapElement = (
        <GMap
          results={props.creationPlaces}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKWw5FjhwLsfp_l2gjVAifPkT3cxGXhA4&v=3.exp&libraries=geometry,drawing,places,visualization"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      );
    } else {
      mapElement = (
        <LeafletMap
          results={creationPlaces}
          mapMode={options.mapMode}
          geoJSON={map.geoJSON}
          geoJSONKey={map.geoJSONKey}
          getGeoJSON={props.getGeoJSON}
          bouncingMarker={map.bouncingMarker}
          popupMarker={map.popupMarker}
          bouncingMarkerKey={map.bouncingMarkerKey}
          openPopupMarkerKey={map.openPopupMarkerKey}
        />
      );
    }
  }

  //console.log(creationPlaces)
  let statistics = '';
  if ((oneColumnView && options.resultFormat === 'statistics') || (!oneColumnView)) {
    statistics = (
      <div className={oneColumnView ? classes.statisticsOneColumn : classes.statistics}>
        <Pie data={creationPlaces} groupBy={props.search.groupBy} query={props.search.query} />
      </div>
    );
  }

  let mainResultsView = '';
  if (oneColumnView) {
    switch(options.resultFormat) {
      case 'table': {
        mainResultsView = table;
        break;
      }
      case 'map': {
        mainResultsView = (
          <div className={classes.fullMap}>
            {map}
          </div>
        );
        break;
      }
      case 'statistics': {
        mainResultsView = statistics;
        break;
      }
    }
  } else {
    mainResultsView = table;
  }

  // map = '';

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <TopBar
          results={manuscripts}
          oneColumnView={oneColumnView}
          mapMode={options.mapMode}
          resultFormat={options.resultFormat}
          updateMapMode={props.updateMapMode}
          updateResultFormat={props.updateResultFormat}
          datasets={search.datasets}
          toggleDataset={props.toggleDataset}
        />
        <div className={classes.mainContainer}>
          {mainResultsView}
          {!oneColumnView &&
            <div className={classes.rightColumn}>
              <div className={classes.map}>
                {mapElement}
              </div>
              {statistics}
            </div>
          }
        </div>
        <Paper className={classes.footer}>
          <img className={classes.aaltoLogo} src='img/logos/aalto-logo-white-no-background-small.png' alt='Aalto University logo'/>
          <img className={classes.uhLogo} src='img/logos/university-of-helsinki-logo-white-no-background-small.png' alt='University of Helsinki logo'/>
          <img className={classes.secoLogo} src='img/logos/seco-logo-white-no-background-small.png' alt='SeCo logo'/>
          <img className={classes.heldigLogo} src='img/logos/heldig-logo-small.png' alt='HELDIG logo'/>
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    options: state.options,
    browser: state.browser,
    search: state.search,
    map: state.map,
    // results: getVisibleResults(state.search),
    manuscripts: state.search.manuscripts,
    creationPlaces: state.search.places,
    //resultValues: getVisibleValues(state.search),
    resultValues: {},
  };
};

const mapDispatchToProps = ({
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchManuscripts,
  fetchPlaces,
  clearManuscripts,
  clearPlaces,
  sortResults,
  getGeoJSON,
  updateResultFormat,
  updateMapMode,
  updateResultsFilter,
  bounceMarker,
  openMarkerPopup,
  removeTempMarker
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  //error: PropTypes.object.isRequired,
  browser: PropTypes.object.isRequired,

  options: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  manuscripts: PropTypes.array,
  creationPlaces: PropTypes.array,
  resultValues: PropTypes.object,

  updateQuery: PropTypes.func.isRequired,
  toggleDataset: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  clearManuscripts: PropTypes.func.isRequired,
  clearPlaces: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  getGeoJSON: PropTypes.func.isRequired,
  bounceMarker: PropTypes.func.isRequired,
  openMarkerPopup: PropTypes.func.isRequired,
  removeTempMarker: PropTypes.func.isRequired,
  updateResultFormat: PropTypes.func.isRequired,
  updateMapMode: PropTypes.func.isRequired,
  updateResultsFilter: PropTypes.func.isRequired,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withWidth(),
  withStyles(styles, {withTheme: true}),
)(MapApp);
