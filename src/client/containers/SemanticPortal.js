import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import { Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TopBar from '../components/main_layout/TopBar';
import Main from '../components/main_layout/Main';
import Footer from '../components/main_layout/Footer';
import Message from '../components/main_layout/Message';
import FacetBar from '../components/facet_bar/FacetBar';
import Manuscripts from '../components/perspectives/Manuscripts';
import Works from '../components/perspectives/Works';
import Places from '../components//perspectives/Places';
import People from '../components//perspectives/People';
import Organizations from '../components/perspectives/Organizations';
import All from '../components/perspectives/All';
import {
  fetchPaginatedResults,
  fetchResults,
  fetchResultsClientSide,
  clearResults,
  fetchByURI,
  fetchFacet,
  sortResults,
  updateFacetOption,
  updatePage,
  showError
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
    minWidth: 300,
    //minHeight: 700
  },
  mainContainer: {
    marginTop: 64,
    height: 'calc(100% - 128px)',
    [theme.breakpoints.down(600)]: {
      marginTop: 56,
      height: 'calc(100% - 122px)',
    },
    backgroundColor: '#bdbdbd',
    padding: theme.spacing.unit,
  },
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
    paddingBottom: '0px !important'
  },
  resultsContainerPaper: {
    height: '100%'

  }
});

let SemanticPortal = (props) => {
  const { classes, /* browser */ error } = props;
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <Message error={error} />
        <React.Fragment>
          <TopBar
            search={props.clientSideFacetedSearch}
            fetchResultsClientSide={props.fetchResultsClientSide}
            clearResults={props.clearResults}
          />
          <Grid container spacing={8} className={classes.mainContainer}>
            <Route exact path="/" component={Main} />
            <Route
              path="/manuscripts"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>
                    <FacetBar
                      facetData={props.manuscriptsFacets}
                      facetClass='manuscripts'
                      resultClass='manuscripts'
                      fetchFacet={props.fetchFacet}
                      updateFacetOption={props.updateFacetOption}
                    />
                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <Manuscripts
                        manuscripts={props.manuscripts}
                        places={props.places}
                        facetData={props.manuscriptsFacets}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchResults={props.fetchResults}
                        fetchByURI={props.fetchByURI}
                        updatePage={props.updatePage}
                        updateFacetOption={props.updateFacetOption}
                        sortResults={props.sortResults}
                        routeProps={routeProps}
                      />
                    </Paper>
                  </Grid>
                </React.Fragment>
              }
            />
            <Route
              path="/works"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>
                    <FacetBar
                      facetData={props.worksFacets}
                      facetClass='works'
                      resultClass='works'
                      fetchFacet={props.fetchFacet}
                      updateFacetOption={props.updateFacetOption}
                    />
                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <Works
                        works={props.works}
                        places={props.places}
                        facetData={props.worksFacets}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchResults={props.fetchResults}
                        fetchByURI={props.fetchByURI}
                        updatePage={props.updatePage}
                        sortResults={props.sortResults}
                        routeProps={routeProps}
                      />
                    </Paper>
                  </Grid>
                </React.Fragment>
              }
            />
            <Route
              path="/people"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>
                    <FacetBar
                      facetData={props.peopleFacets}
                      facetClass='people'
                      resultClass='people'
                      fetchFacet={props.fetchFacet}
                      updateFacetOption={props.updateFacetOption}
                    />
                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <People
                        people={props.people}
                        places={props.places}
                        facetData={props.peopleFacets}
                        fetchResults={props.fetchResults}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchByURI={props.fetchByURI}
                        filters={props.manuscriptsFacets.filters}
                        updatePage={props.updatePage}
                        sortResults={props.sortResults}
                        routeProps={routeProps}
                      />
                    </Paper>
                  </Grid>
                </React.Fragment>
              }
            />
            <Route
              path="/organizations"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>
                    <FacetBar
                      facetData={props.organizationsFacets}
                      facetClass='organizations'
                      resultClass='organizations'
                      fetchFacet={props.fetchFacet}
                      updateFacetOption={props.updateFacetOption}
                    />
                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <Organizations
                        organizations={props.organizations}
                        places={props.places}
                        facetData={props.organizationsFacets}
                        fetchResults={props.fetchResults}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchByURI={props.fetchByURI}
                        filters={props.manuscriptsFacets.filters}
                        updatePage={props.updatePage}
                        sortResults={props.sortResults}
                        routeProps={routeProps}
                      />
                    </Paper>
                  </Grid>
                </React.Fragment>
              }
            />
            <Route
              path="/places"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>
                    <FacetBar
                      facetData={props.placesFacets}
                      facetClass='places'
                      resultClass='places'
                      fetchFacet={props.fetchFacet}
                      updateFacetOption={props.updateFacetOption}
                    />
                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <Places
                        places={props.places}
                        facetData={props.placesFacets}
                        fetchResults={props.fetchResults}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchByURI={props.fetchByURI}
                        filters={props.manuscriptsFacets.filters}
                        updatePage={props.updatePage}
                        sortResults={props.sortResults}
                        routeProps={routeProps}
                      />
                    </Paper>
                  </Grid>
                </React.Fragment>
              }
            />
            <Route
              path="/all"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>

                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <All
                        clientSideFacetedSearch={props.clientSideFacetedSearch}
                        routeProps={routeProps}
                      />
                    </Paper>
                  </Grid>
                </React.Fragment>
              }
            />
          </Grid>
        </React.Fragment>
        <Footer />
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
    people: state.people,
    peopleFacets: state.peopleFacets,
    organizations: state.organizations,
    organizationsFacets: state.organizationsFacets,
    places: state.places,
    placesFacets: state.placesFacets,
    clientSideFacetedSearch: state.clientSideFacetedSearch,
    error: state.error
    //browser: state.browser,
  };
};

const mapDispatchToProps = ({
  fetchPaginatedResults,
  fetchResults,
  fetchResultsClientSide,
  fetchByURI,
  fetchFacet,
  sortResults,
  clearResults,
  updateFacetOption,
  updatePage,
  showError
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
  people: PropTypes.object.isRequired,
  peopleFacets: PropTypes.object.isRequired,
  organizations: PropTypes.object.isRequired,
  organizationsFacets: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  placesFacets: PropTypes.object.isRequired,
  clientSideFacetedSearch: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchResultsClientSide: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
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
