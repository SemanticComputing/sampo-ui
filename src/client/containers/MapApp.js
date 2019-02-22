import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Route } from 'react-router-dom';
import Manuscripts from '../components/Manuscripts';
// import Works from '../components/Works';
import Places from '../components/Places';
import Main from '../components/Main';
import FacetBar from '../components/FacetBar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


import {
  fetchPaginatedResults,
  fetchResults,
  fetchByURI,
  fetchFacet,
  sortResults,
  updateFilter,
  updatePage,
  openFacetDialog,
  closeFacetDialog
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

let MapApp = (props) => {
  const { classes /* browser error */ } = props;
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <React.Fragment>
          <TopBar />
          <Grid container spacing={8} className={classes.mainContainer}>
            <Route exact path="/" component={Main} />

            <Route
              path="/manuscripts"
              render={routeProps =>
                <React.Fragment>
                  <Grid item sm={12} md={3} className={classes.facetBarContainer}>
                    <FacetBar
                      facetData={props.manuscriptsFacets}
                      resultClass='manuscripts'
                      fetchFacet={props.fetchFacet}
                      updateFilter={props.updateFilter}
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
                      resultClass='places'
                      fetchFacet={props.fetchFacet}
                      updateFilter={props.updateFilter}
                    />
                  </Grid>
                  <Grid item sm={12} md={9} className={classes.resultsContainer}>
                    <Paper className={classes.resultsContainerPaper}>
                      <Places
                        places={props.places}
                        facetData={props.placesFacets}
                        fetchResults={props.fetchResults}
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
    places: state.places,
    placesFacets: state.placesFacets,
    //browser: state.browser,
  };
};

const mapDispatchToProps = ({
  fetchPaginatedResults,
  fetchResults,
  fetchByURI,
  fetchFacet,
  sortResults,
  updateFilter,
  updatePage,
  openFacetDialog,
  closeFacetDialog
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  // error: PropTypes.object.isRequired,
  // browser: PropTypes.object.isRequired,
  manuscripts: PropTypes.object.isRequired,
  manuscriptsFacets: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  placesFacets: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  openFacetDialog: PropTypes.func.isRequired,
  closeFacetDialog: PropTypes.func.isRequired
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withWidth(),
  withStyles(styles, {withTheme: true}),
)(MapApp);
