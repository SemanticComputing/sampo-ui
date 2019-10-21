import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import { Link, NavLink } from 'react-router-dom';
import TopBarSearchField from './TopBarSearchField';
import TopBarInfoButton from './TopBarInfoButton';
// import TopBarLanguageButton from './TopBarLanguageButton';
import Divider from '@material-ui/core/Divider';
import { has } from 'lodash';

const styles = theme => ({
  root: {
    //width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    //
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
  },
  link: {
    textDecoration: 'none'
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  appBarButton: {
    color: 'white !important',
    border: `1px solid ${theme.palette.primary.main}`
  },
  appBarButtonActive: {
    border: '1px solid white'
  },
  appBarDivider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderLeft: '2px solid white'
  }
});

class TopBar extends React.Component {
  state = {
    infoAnchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleInfoMenuOpen = event => {
    this.setState({ infoAnchorEl: event.currentTarget });
  };

  handleInfoMenuClose = () => {
    this.setState({ infoAnchorEl: null });
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  // https://material-ui.com/components/buttons/#third-party-routing-library
  AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);
  AdapterNavLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);

  renderMobileMenuItem = perspective => {
    if (has(perspective, 'externalUrl')) {
      return(
        <a className={this.props.classes.link}
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>
            {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </MenuItem>
        </a>
      );
    } else {
      return(
        <MenuItem
          key={perspective.id}
          component={this.AdapterLink}
          to={`/${perspective.id}/faceted-search`}
        >
          {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
        </MenuItem>
      );
    }
  }

  renderDesktopTopMenuItem = perspective => {
    if (has(perspective, 'externalUrl')) {
      return(
        <a className={this.props.classes.link}
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button
            className={this.props.classes.appBarButton}
          >
            {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </Button>
        </a>
      );
    } else {
      return(
        <Button
          key={perspective.id}
          className={this.props.classes.appBarButton}
          component={this.AdapterNavLink}
          to={`/${perspective.id}/faceted-search`}
          isActive={(match, location) => location.pathname.startsWith(`/${perspective.id}`)}
          activeClassName={this.props.classes.appBarButtonActive}
        >
          {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
        </Button>
      );
    }
  }

  renderMobileMenu = perspectives =>
    <Menu
      anchorEl={this.state.mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(this.state.mobileMoreAnchorEl)}
      onClose={this.handleMobileMenuClose}
    >
      {perspectives.map(perspective => this.renderMobileMenuItem(perspective))}
      <Divider />
      <MenuItem
        key='feedback'
        component={this.AdapterLink}
        to={`/feedback`}
      >
        FEEDBACK
      </MenuItem>
      <MenuItem
        key={0}
        component={this.AdapterLink}
        to={`/about`}
      >
        ABOUT THE PROJECT
      </MenuItem>
      <a className={this.props.classes.link}
        key={1}
        href='http://mappingmanuscriptmigrations.org'
        target='_blank'
        rel='noopener noreferrer'
      >
        <MenuItem>
          BLOG
        </MenuItem>
      </a>
      <MenuItem
        key='info'
        component={this.AdapterLink}
        to={`/instructions`}
      >
        INSTRUCTIONS
      </MenuItem>
    </Menu>

  render() {
    const { classes, perspectives, currentLocale, availableLocales } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="absolute">
          <Toolbar>
            <Button
              className={classes.appBarButton}
              component={this.AdapterLink}
              to='/'
            >
              <Typography className={classes.title} variant="h6" color="inherit">
                MMM
              </Typography>
            </Button>
            <TopBarSearchField
              fetchResultsClientSide={this.props.fetchResultsClientSide}
              clearResults={this.props.clearResults}
            />
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {perspectives.map((perspective, index) => this.renderDesktopTopMenuItem(perspective, index))}
              <div className={classes.appBarDivider}></div>
              <Button
                className={classes.appBarButton}
                component={this.AdapterNavLink}
                to={`/feedback`}
                isActive={(match, location) => location.pathname.startsWith(`/feedback`)}
                activeClassName={this.props.classes.appBarButtonActive}
              >
                Feedback
              </Button>
              <TopBarInfoButton />
              <Button
                className={classes.appBarButton}
                component={this.AdapterNavLink}
                to={`/instructions`}
                isActive={(match, location) => location.pathname.startsWith(`/instructions`)}
                activeClassName={this.props.classes.appBarButtonActive}
              >
                Instructions
              </Button>
              { /* <TopBarLanguageButton
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                loadLocales={this.props.loadLocales}
              /> */}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMobileMenu(perspectives)}
      </div>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchResultsClientSide: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  loadLocales: PropTypes.func.isRequired,
  perspectives: PropTypes.array.isRequired,
  currentLocale: PropTypes.string.isRequired,
  availableLocales: PropTypes.array.isRequired
};

export default withStyles(styles)(TopBar);
