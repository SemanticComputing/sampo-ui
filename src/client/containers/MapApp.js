import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import Paper from '@material-ui/core/Paper';
import TopBar from '../components/TopBar';
import { Route } from 'react-router-dom';
import Manuscripts from '../components/Manuscripts';
import Main from '../components/Main';

import {
  fetchManuscripts,
  fetchPlaces,
  fetchPlace,
  fetchFacet,
  updateFilter,
  fetchResults,
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
    minWidth: 300,
    //minHeight: 700
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 64,
    height: 'calc(100% - 128px)',
    [theme.breakpoints.down(600)]: {
      marginTop: 56,
      height: 'calc(100% - 122px)',
    },
    borderRight: '4px solid' + theme.palette.primary.main,
    borderLeft: '4px solid' + theme.palette.primary.main,
    backgroundColor: 'rgb(238, 238, 238)'
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
});

let MapApp = (props) => {
  const { classes, facet, map, search } = props;
  // browser
  // error,

  // console.log(props.facet)

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <TopBar />
        <div className={classes.mainContainer}>
          <Route
            exact path="/"
            component={Main}
          />
          <Route
            path="/manuscripts"
            render={() =>
              <Manuscripts
                facet={facet}
                map={map}
                search={search}
                fetchManuscripts={props.fetchManuscripts}
                fetchPlaces={props.fetchPlaces}
                fetchPlace={props.fetchPlace}
                fetchFacet={props.fetchFacet}
                fetchResults={props.fetchResults}
                updateFilter={props.updateFilter}
                match={props.match}
              />}
          />
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
// <img className={classes.secoLogo} src='img/logos/seco-logo-white-no-background-small.png' alt='SeCo logo'/>
// <img className={classes.heldigLogo} src='img/logos/heldig-logo-small.png' alt='HELDIG logo'/>
// <img className={classes.uhLogo} src='img/logos/university-of-helsinki-logo-white-no-background-small.png' alt='University of Helsinki logo'/>

const mapStateToProps = (state) => {
  return {
    facet: state.facet,
    map: state.map,
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
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  // error: PropTypes.object.isRequired,
  // browser: PropTypes.object.isRequired,
  facet: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
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
