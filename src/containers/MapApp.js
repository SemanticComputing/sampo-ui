import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import PlaceIcon from '@material-ui/icons/Place';
import IntegrationAutosuggest from '../components/IntegrationAutosuggest';
import LeafletMap from '../components/LeafletMap';
import Message from '../components/Message';
import SimpleTable from '../components/SimpleTable';
// import DataTable from '../components/DataTable';
// import DataGrid from '../components/DataGrid';

import {
  updateQuery,
  updateDatasets,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  openDrawer,
  closeDrawer,
  setMapReady,
  getGeoJSON
} from '../actions';

const drawerWidth = 600;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    //padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
});

let MapApp = (props) => {
  const { classes, error, theme, drawerIsOpen, mapReady } = props;
  const anchor = 'left';

  //console.log(props.search.results)

  const drawer = (
    <Drawer
      variant="persistent"
      anchor={anchor}
      open={drawerIsOpen}
      width={drawerWidth}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <Tabs
          value={0}
          onChange={null}
          fullWidth
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="Places" />
          <Tab label="Maps" disabled />
          <Tab label="Options" disabled />
        </Tabs>
        <IconButton onClick={props.closeDrawer}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <IntegrationAutosuggest
        search={props.search}
        updateQuery={props.updateQuery}
        fetchSuggestions={props.fetchSuggestions}
        clearSuggestions={props.clearSuggestions}
        fetchResults={props.fetchResults}
        clearResults={props.clearResults}
      />
      {props.search.results.length > 0 &&
        <SimpleTable data={props.search.results} />
      }
    </Drawer>
  );

  let before = null;
  let after = null;

  if (anchor === 'left') {
    before = drawer;
  } else {
    after = drawer;
  }

  if (!mapReady) {
    props.setMapReady();
    setTimeout(() => {
      props.openDrawer();
    }, 300);
  }

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: drawerIsOpen,
            [classes[`appBarShift-${anchor}`]]: drawerIsOpen,
          })}
        >
          <Toolbar disableGutters={!drawerIsOpen}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={props.openDrawer}
              className={classNames(classes.menuButton, drawerIsOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Hipla.fi
            </Typography>
          </Toolbar>
        </AppBar>
        {before}
        <main
          className={classNames(classes.content, classes[`content-${anchor}`], {
            [classes.contentShift]: drawerIsOpen,
            [classes[`contentShift-${anchor}`]]: drawerIsOpen,
          })}
        >
          <div className={classes.drawerHeader} />
          <Message error={error} />
          <LeafletMap
            sliderValue={100}
            results={props.search.results}
            geoJSON={props.geoJSON}
            geoJSONKey={props.geoJSONKey}
            getGeoJSON={props.getGeoJSON}
          />
        </main>
        {after}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  search: state.search,
  drawerIsOpen: state.options.drawerIsOpen,
  mapReady: state.options.mapReady,
  error: state.error,
  geoJSON: state.map.geoJSON,
  geoJSONKey: state.map.geoJSONKey
});

const mapDispatchToProps = ({
  openDrawer,
  closeDrawer,
  updateQuery,
  updateDatasets,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  setMapReady,
  getGeoJSON
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  drawerIsOpen: PropTypes.bool.isRequired,
  mapReady: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  setMapReady: PropTypes.func.isRequired,
  geoJSON: PropTypes.object.isRequired,
  geoJSONKey: PropTypes.number,
  getGeoJSON: PropTypes.func.isRequired,
};

MapApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(MapApp));

export default MapApp;
