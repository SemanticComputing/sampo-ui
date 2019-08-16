import React from 'react';
import PropTypes from 'prop-types';
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
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  link: {
    textDecoration: 'none'
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBarButton: {
    color: 'white !important',
    border: `1px solid ${theme.palette.primary.main}`
  },
  appBarButtonActive: {
    border: '1px solid white'
  }
});

class TopBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleInfoMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
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
            {perspective.label.toUpperCase()}
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
          {perspective.label.toUpperCase()}
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
            {perspective.label}
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
          {perspective.label}
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
    </Menu>

  render() {
    const { classes, perspectives } = this.props;
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
              {perspectives.map(perspective => this.renderDesktopTopMenuItem(perspective))}
              {/* <Button className={classes.appBarButton} aria-haspopup="true" onClick={this.handleInfoMenuOpen}>
                <span>Info</span>
              </Button> */}
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
  perspectives: PropTypes.array.isRequired
};

export default withStyles(styles)(TopBar);
