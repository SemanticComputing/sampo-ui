import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Manuscripts from '../components/Manuscripts';
import Main from '../components/Main';
import FacetBar from '../components/FacetBar';
import Grid from '@material-ui/core/Grid';


import {
  fetchManuscripts,
  fetchPlaces,
  fetchPlace,
  fetchFacet,
  updateFilter,
  fetchResults,
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
    backgroundColor: '#E0E0E0',
    // paddingLeft: 8,
    // paddingRight: 8,
    // paddingTop: 4
  },
  gridItem: {
    borderRight: '4px solid' + theme.palette.primary.main,
  }
});

let MapApp = (props) => {
  const { classes } = props;
  // browser
  // error,
  //console.log(props.facet)
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <Router>
          <React.Fragment>
            <TopBar />
            <Grid container className={classes.mainContainer}>
              <Route exact path="/" component={Main} />
              <Route
                path="/manuscripts"
                render={routeProps =>
                  <React.Fragment>
                    <Grid item sm={12} md={4} className={classes.gridItem} >
                      <FacetBar
                        facet={props.facet}
                        fetchFacet={props.fetchFacet}
                        updateFilter={props.updateFilter}
                        updatePage={props.updatePage}
                      />
                    </Grid>
                    <Grid item sm={12} md={8}>
                      <Manuscripts
                        search={props.search}
                        facetFilters={props.facet.facetFilters}
                        fetchManuscripts={props.fetchManuscripts}
                        fetchPlaces={props.fetchPlaces}
                        fetchPlace={props.fetchPlace}
                        updatePage={props.updatePage}
                        routeProps={routeProps}
                      />
                    </Grid>
                  </React.Fragment>
                }
              />
            </Grid>
          </React.Fragment>
        </Router>
        <Footer />
      </div>
    </div>
  );
};
// <img className={classes.secoLogo} src='img/logos/seco-logo-white-no-background-small.png' alt='SeCo logo'/>
// <img className={classes.heldigLogo} src='img/logos/heldig-logo-small.png' alt='HELDIG logo'/>
// <img className={classes.uhLogo} src='img/logos/university-of-helsinki-logo-white-no-background-small.png' alt='University of Helsinki logo'/>

const mapStateToProps = (state) => {
  return {
    facet: state.facet,
    search: state.search,
    //browser: state.browser,
  };
};

const mapDispatchToProps = ({
  fetchManuscripts,
  fetchPlaces,
  fetchPlace,
  fetchFacet,
  fetchResults,
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
  facet: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
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
