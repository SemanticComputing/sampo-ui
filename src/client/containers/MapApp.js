import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import Paper from '@material-ui/core/Paper';
import ResultTable from '../components/ResultTable';
import LeafletMap from '../components/LeafletMap';
import Pie from '../components/Pie';
import TopBar from '../components/TopBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

import {
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchManuscripts,
  fetchPlaces,
  fetchPlace,
  fetchFacet,
  fetchResults,
  clearManuscripts,
  clearPlaces,
  clearFacet,
  getGeoJSON,
  updateResultFormat,
  updateMapMode,
  updateResultsFilter,
  sortResults,
  bounceMarker,
  openMarkerPopup,
  removeTempMarker
} from '../actions';

const logoPadding = 50;
const logoHeight = 52;

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
    width: '100%',
    height: 'calc(100% - 5px)',
    overflow: 'auto'
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
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    marginRight: 15
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
  oxfordLogo: {
    //paddingLeft: 24,
    height: logoHeight
  },
  pennLogo: {
    paddingLeft: logoPadding,
    height: logoHeight - 8
  },
  cnrsLogo: {
    paddingLeft: logoPadding,
    height: logoHeight
  },
  aaltoLogo: {
    paddingLeft: logoPadding,
    height: logoHeight - 10
  },
  // uhLogo: {
  //   paddingLeft: logoPadding,
  //   height: logoHeight
  // },
  // secoLogo: {
  //   paddingLeft: logoPadding,
  //   height: logoHeight - 5
  // },
  // heldigLogo: {
  //   paddingLeft: logoPadding,
  //   height: logoHeight - 10
  // },
});

let MapApp = (props) => {
  const { classes, options, search, map, manuscripts, creationPlaces, place, facet } = props;
  // browser
  //error,

  let oneColumnView = true;

  console.log(manuscripts);
  //console.log(place)

  let table = '';
  if (search.fetchingManuscripts) {
    const tableClass = oneColumnView ? classes.resultTableOneColumn : classes.resultTable;

    //<Typography className={classes.progressTitle} variant="h4">Fetching manuscript data</Typography>
    table = (
      <div className={[tableClass, classes.progress].join(' ')}>
        <CircularProgress style={{ color: purple[500] }} thickness={5} />
      </div>
    );
  } else {
    if ((oneColumnView && options.resultFormat === 'table') || (!oneColumnView)) {
      //console.log(facetValues)
      table = (
        <div className={oneColumnView ? classes.resultTableOneColumn : classes.resultTable}>
          <ResultTable
            rows={manuscripts}
            facet={facet}
            fetchManuscripts={props.fetchManuscripts}
            fetchFacet={props.fetchFacet}
            results={props.results}
            page={props.page}
          />
        </div>
      );
    }
  }

  let mapElement = '';
  if ((oneColumnView && options.resultFormat === 'map') || (!oneColumnView)) {
    mapElement = (
      <LeafletMap
        fetchPlaces={props.fetchPlaces}
        fetchPlace={props.fetchPlace}
        fetchManuscripts={props.fetchManuscripts}
        results={creationPlaces}
        place={place}
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
            {mapElement}
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
          oneColumnView={oneColumnView}
          mapMode={options.mapMode}
          resultFormat={options.resultFormat}
          updateMapMode={props.updateMapMode}
          updateResultFormat={props.updateResultFormat}
          fetchManuscripts={props.fetchManuscripts}
          fetchResults={props.fetchResults}
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
          <img className={classes.oxfordLogo} src='img/logos/oxford-logo-white.png' alt='Oxford University logo'/>
          <img className={classes.pennLogo} src='img/logos/penn-logo-white.png' alt='Oxford University logo'/>
          <img className={classes.cnrsLogo} src='img/logos/cnrs-logo-white-small.png' alt='CNRS logo'/>
          <img className={classes.aaltoLogo} src='img/logos/aalto-logo-white-no-background-small.png' alt='Aalto University logo'/>


        </Paper>
      </div>
    </div>
  );
};


//<img className={classes.secoLogo} src='img/logos/seco-logo-white-no-background-small.png' alt='SeCo logo'/>
// <img className={classes.heldigLogo} src='img/logos/heldig-logo-small.png' alt='HELDIG logo'/>
//  <img className={classes.uhLogo} src='img/logos/university-of-helsinki-logo-white-no-background-small.png' alt='University of Helsinki logo'/>


const mapStateToProps = (state) => {
  return {
    options: state.options,
    browser: state.browser,
    search: state.search,
    map: state.map,
    manuscripts:state.search.manuscripts,
    creationPlaces: state.search.places,
    place: state.search.place,
    facet: state.facet,
    results: state.search.results,
    page: state.search.page
  };
};

const mapDispatchToProps = ({
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchManuscripts,
  fetchPlaces,
  fetchPlace,
  fetchResults,
  fetchFacet,
  clearManuscripts,
  clearPlaces,
  clearFacet,
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
  creationPlaces: PropTypes.array.isRequired,
  place: PropTypes.object.isRequired,
  facet: PropTypes.object.isRequired,
  results: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,

  updateQuery: PropTypes.func.isRequired,
  toggleDataset: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearManuscripts: PropTypes.func.isRequired,
  clearPlaces: PropTypes.func.isRequired,
  clearFacet: PropTypes.func.isRequired,
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
