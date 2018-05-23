import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IntegrationAutosuggest from '../components/IntegrationAutosuggest';
import LeafletMap from '../components/LeafletMap';
import Message from '../components/Message';
// import ResultTable from '../components/ResultTable';
import SimpleTable from '../components/SimpleTable';

import {
  updateQuery,
  updateDatasets,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  openDrawer,
  closeDrawer
} from '../actions';

const drawerWidth = 700;

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
    justifyContent: 'flex-end',
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
  const { classes, error, theme, drawerIsOpen } = props;
  const anchor = 'left';
  //console.log("MapApp.js", props);

  // handleChangeAnchor = event => {
  //   this.setState({
  //     anchor: event.target.value,
  //   });
  // };

  const drawer = (
    <Drawer
      variant="persistent"
      anchor={anchor}
      open={drawerIsOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IntegrationAutosuggest
          search={props.search}
          updateQuery={props.updateQuery}
          fetchSuggestions={props.fetchSuggestions}
          clearSuggestions={props.clearSuggestions}
          fetchResults={props.fetchResults}
        />
        <IconButton onClick={props.closeDrawer}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <SimpleTable search={props.search} />
    </Drawer>
  );

  let before = null;
  let after = null;

  if (anchor === 'left') {
    before = drawer;
  } else {
    after = drawer;
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
          <LeafletMap results={props.search.results} />
        </main>
        {after}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  search: state.search,
  drawerIsOpen: state.options.drawerIsOpen,
  error: state.error,
});

const mapDispatchToProps = ({
  openDrawer,
  closeDrawer,
  updateQuery,
  updateDatasets,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  drawerIsOpen: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
};

MapApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(MapApp));

export default MapApp;
