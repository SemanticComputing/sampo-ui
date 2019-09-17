import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import { Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TopBar from '../components/main_layout/TopBar';
import Main from '../components/main_layout/Main';
import Footer from '../components/main_layout/Footer';
import Message from '../components/main_layout/Message';
import FacetBar from '../components/facet_bar/FacetBar';
import Manuscripts from '../components/perspectives/Manuscripts';
import Works from '../components/perspectives/Works';
import Events from '../components/perspectives/Events';
import Places from '../components/perspectives/Places';
import Actors from '../components/perspectives/Actors';
import All from '../components/perspectives/All';
import InstanceHomePage from '../components/main_layout/InstanceHomePage';
//import FeedbackPage from '../components/main_layout/FeedbackPage';
import { perspectiveArr } from '../components/perspectives/PerspectiveArrayMMM';
import InfoHeader from '../components/main_layout/InfoHeader';
import { has } from 'lodash';
//import { urlToState } from '../helpers/helpers';
import {
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchResultsClientSide,
  clearResults,
  fetchByURI,
  fetchFacet,
  sortResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  showError,
  updatePerspectiveHeaderExpanded,
} from '../actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%',
    }
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
    minWidth: 300,
  //minHeight: 700
  },
  mainContainer: {
    height: 'auto',
    backgroundColor: '#bdbdbd',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 56,
      height: 'calc(100% - 56px)',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)',
    },
  },
  perspectiveContainerHeaderExpanded: {
    height: 'auto',
    backgroundColor: '#bdbdbd',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 268, // 56 + 212
      height: 'calc(100% - 268px)',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 276, // 64 + 212
      height: 'calc(100% - 276px)',
    },
  },
  perspectiveContainer: {
    height: 'auto',
    backgroundColor: '#bdbdbd',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 137, // 56 + 81
      height: 'calc(100% - 137px)',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 145, // 64 + 81
      height: 'calc(100% - 145px)',
    },
  },
  instancePageContainerHeaderExpanded: {
    height: 'auto',
    backgroundColor: '#bdbdbd',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 308, // 56 + 244 + 8
      height: 'calc(100% - 308px)',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 316, // 64 + 244 + 8
      height: 'calc(100% - 316px)',
    },
  },
  instancePageContainer: {
    height: 'auto',
    backgroundColor: '#bdbdbd',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 177, // 56 + 113 + 8
      height: 'calc(100% - 177px)',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 185, // 64 + 113 + 8
      height: 'calc(100% - 185px)',
    },
  },
  // perspective container is divided into two columns:
  facetBarContainer: {
    height: '100%',
    overflow: 'auto',
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  },
  resultsContainer: {
    height: '100%',
    overflow: 'auto',
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1)
    },
  },
  instancePageContent: {
    height: '100%',
    //overflow: 'auto',
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  }
});

let SemanticPortal = props => {
  const { classes, /* browser */ error } = props;

  const renderPerspective = (perspective, routeProps) => {
    let perspectiveElement = null;
    switch(perspective.id) {
      case 'manuscripts':
        perspectiveElement =
        <Manuscripts
          manuscripts={props.manuscripts}
          places={props.places}
          facetData={props.manuscriptsFacets}
          fetchPaginatedResults={props.fetchPaginatedResults}
          fetchResults={props.fetchResults}
          fetchByURI={props.fetchByURI}
          updatePage={props.updatePage}
          updateRowsPerPage={props.updateRowsPerPage}
          updateFacetOption={props.updateFacetOption}
          sortResults={props.sortResults}
          routeProps={routeProps}
          perspective={perspective}
        />;
        break;
      case 'works':
        perspectiveElement =
        <Works
          works={props.works}
          places={props.places}
          facetData={props.worksFacets}
          fetchPaginatedResults={props.fetchPaginatedResults}
          fetchResults={props.fetchResults}
          fetchByURI={props.fetchByURI}
          updatePage={props.updatePage}
          updateRowsPerPage={props.updateRowsPerPage}
          sortResults={props.sortResults}
          routeProps={routeProps}
          perspective={perspective}
        />;
        break;
      case 'events':
        perspectiveElement =
        <Events
          events={props.events}
          facetData={props.eventsFacets}
          fetchPaginatedResults={props.fetchPaginatedResults}
          fetchResults={props.fetchResults}
          fetchByURI={props.fetchByURI}
          updatePage={props.updatePage}
          updateRowsPerPage={props.updateRowsPerPage}
          sortResults={props.sortResults}
          routeProps={routeProps}
          perspective={perspective}
        />;
        break;
      case 'actors':
        perspectiveElement =
        <Actors
          actors={props.actors}
          places={props.places}
          facetData={props.actorsFacets}
          fetchResults={props.fetchResults}
          fetchPaginatedResults={props.fetchPaginatedResults}
          fetchByURI={props.fetchByURI}
          filters={props.manuscriptsFacets.filters}
          updatePage={props.updatePage}
          updateRowsPerPage={props.updateRowsPerPage}
          updateFacetOption={props.updateFacetOption}
          sortResults={props.sortResults}
          routeProps={routeProps}
          perspective={perspective}
        />;
        break;
      case 'places':
        perspectiveElement =
        <Places
          places={props.places}
          facetData={props.placesFacets}
          fetchResults={props.fetchResults}
          fetchPaginatedResults={props.fetchPaginatedResults}
          fetchByURI={props.fetchByURI}
          filters={props.manuscriptsFacets.filters}
          updatePage={props.updatePage}
          updateRowsPerPage={props.updateRowsPerPage}
          sortResults={props.sortResults}
          routeProps={routeProps}
          perspective={perspective}
        />;
        break;
      default:
        perspectiveElement = <div></div>;
        break;
    }
    return perspectiveElement;
  };

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <Message error={error} />
        <React.Fragment>
          <TopBar
            search={props.clientSideFacetedSearch}
            fetchResultsClientSide={props.fetchResultsClientSide}
            clearResults={props.clearResults}
            perspectives={perspectiveArr}
          />
          <Route
            exact path="/"
            render={() =>
              <Grid container spacing={1} className={classes.mainContainer}>
                <Main perspectives={perspectiveArr}/>
                <Footer />
              </Grid>
            }
          />
          { /* route for full text search results */ }
          <Route
            path="/all"
            render={routeProps =>
              <Grid container spacing={1} className={classes.mainContainer}>
                <Grid item xs={12} className={classes.resultsContainer}>
                  <All
                    clientSideFacetedSearch={props.clientSideFacetedSearch}
                    routeProps={routeProps}
                  />
                </Grid>
              </Grid>
            }
          />
          { /* routes for perspectives that don't have an external url */ }
          {perspectiveArr.map(perspective => {
            if (!has(perspective, 'externalUrl')) {
              return(
                <React.Fragment key={perspective.id}>
                  <Route
                    path={`/${perspective.id}/faceted-search`}
                    render={routeProps => {
                      return (
                        <React.Fragment>
                          <InfoHeader
                            resultClass={perspective.id}
                            pageType='facetedSearch'
                            expanded={props[perspective.id].facetedSearchHeaderExpanded}
                            updateExpanded={props.updatePerspectiveHeaderExpanded}
                            title={perspective.label}
                            description={perspective.perspectiveDesc}
                            descriptionHeight={perspective.perspectiveDescHeight}
                          />
                          <Grid container spacing={1} className={props[perspective.id].facetedSearchHeaderExpanded
                            ? classes.perspectiveContainerHeaderExpanded
                            : classes.perspectiveContainer
                          }>
                            <Grid item xs={12} md={3} className={classes.facetBarContainer}>
                              <FacetBar
                                facetData={props[`${perspective.id}Facets`]}
                                facetClass={perspective.id}
                                resultClass={perspective.id}
                                fetchingResultCount={props[perspective.id].fetchingResultCount}
                                resultCount={props[perspective.id].resultCount}
                                fetchFacet={props.fetchFacet}
                                fetchResultCount={props.fetchResultCount}
                                updateFacetOption={props.updateFacetOption}
                                defaultActiveFacets={perspective.defaultActiveFacets}
                                resultTableColumns={props[perspective.id].tableColumns}
                              />
                            </Grid>
                            <Grid item xs={12} md={9} className={classes.resultsContainer}>
                              {renderPerspective(perspective, routeProps)}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      );
                    }}
                  />
                  <Route
                    path={`/${perspective.id}/page/:id`}
                    render={routeProps => {
                      return (
                        <React.Fragment>
                          <InfoHeader
                            resultClass={perspective.id}
                            pageType='instancePage'
                            instanceData={props[perspective.id].instance}
                            expanded={props[perspective.id].instancePageHeaderExpanded}
                            updateExpanded={props.updatePerspectiveHeaderExpanded}
                            title={perspective.instancePageLabel}
                            description={perspective.instancePageDesc}
                            descriptionHeight={perspective.perspectiveDescHeight}
                          />
                          <Grid container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                            ? classes.instancePageContainerHeaderExpanded
                            : classes.instancePageContainer
                          }>
                            <Grid item xs={12} className={classes.instancePageContent}>
                              <InstanceHomePage
                                fetchByURI={props.fetchByURI}
                                resultClass={perspective.id}
                                tableRows={props[perspective.id].tableColumns}
                                data={props[perspective.id].instance}
                                isLoading={props[perspective.id].fetching}
                                routeProps={routeProps}
                              />
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      );
                    }}
                  />
                </React.Fragment>
              );
            }
          })}
          { /* create routes for classes that have only info pages and no perspective */}
          <Route
            path={`/collections/page/:id`}
            render={routeProps => {
              return (
                <Grid container spacing={1} className={classes.mainContainer}>
                  <InstanceHomePage
                    fetchByURI={props.fetchByURI}
                    resultClass='collections'
                    tableRows={props.collections.tableColumns}
                    data={props.collections.instance}
                    isLoading={props.collections.fetching}
                    routeProps={routeProps}
                  />
                </Grid>
              );
            }}
          />
          <Route
            path={`/expressions/page/:id`}
            render={routeProps => {
              return (
                <Grid container spacing={1} className={classes.mainContainer}>
                  <InstanceHomePage
                    fetchByURI={props.fetchByURI}
                    resultClass='expressions'
                    tableRows={props.expressions.tableColumns}
                    data={props.expressions.instance}
                    isLoading={props.expressions.fetching}
                    routeProps={routeProps}
                  />
                </Grid>
              );
            }}
          />
          { /* create routes for info buttons */ }
          <Route
            path={`/feedback`}
            render={() => null /* <FeedbackPage /> */ }
          />
        </React.Fragment>
      </div>
    </div>
  );
};
// <img className={classes.secoLogo} src='img/logos/seco-logo-white-no-background-small.png' alt='SeCo logo'/>
// <img className={classes.heldigLogo} src='img/logos/heldig-logo-small.png' alt='HELDIG logo'/>
// <img className={classes.uhLogo} src='img/logos/university-of-helsinki-logo-white-no-background-small.png' alt='University of Helsinki logo'/>

const mapStateToProps = state => {
  return {
    manuscripts: state.manuscripts,
    manuscriptsFacets: state.manuscriptsFacets,
    works: state.works,
    worksFacets: state.worksFacets,
    events: state.events,
    eventsFacets: state.eventsFacets,
    actors: state.actors,
    actorsFacets: state.actorsFacets,
    places: state.places,
    placesFacets: state.placesFacets,
    collections: state.collections,
    expressions: state.expressions,
    clientSideFacetedSearch: state.clientSideFacetedSearch,
    error: state.error
  //browser: state.browser,
  };
};

const mapDispatchToProps = ({
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchResultsClientSide,
  fetchByURI,
  fetchFacet,
  sortResults,
  clearResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  showError,
  updatePerspectiveHeaderExpanded
});

SemanticPortal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  // browser: PropTypes.object.isRequired,
  manuscripts: PropTypes.object.isRequired,
  manuscriptsFacets: PropTypes.object.isRequired,
  works: PropTypes.object.isRequired,
  worksFacets: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  eventsFacets: PropTypes.object.isRequired,
  actors: PropTypes.object.isRequired,
  actorsFacets: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  placesFacets: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  expressions:  PropTypes.object.isRequired,
  clientSideFacetedSearch: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchResultCount: PropTypes.func.isRequired,
  fetchResultsClientSide: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  updatePerspectiveHeaderExpanded: PropTypes.func.isRequired
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withWidth(),
  withStyles(styles, {withTheme: true}),
)(SemanticPortal);
