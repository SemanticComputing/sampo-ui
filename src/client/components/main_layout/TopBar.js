import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { withStyles } from '@material-ui/core/styles'
import MoreIcon from '@material-ui/icons/MoreVert'
import Button from '@material-ui/core/Button'
import { Link, NavLink } from 'react-router-dom'
import TopBarSearchField from './TopBarSearchField'
import TopBarInfoButton from './TopBarInfoButton'
// import TopBarLanguageButton from './TopBarLanguageButton';
import Divider from '@material-ui/core/Divider'
import { has } from 'lodash'
// import mmmLogo from '../../img/mmm-logo-52x50.png'
import secoLogo from '../../img/seco-logo-48x50.png'

const styles = theme => ({
  root: {
    // width: '100%',
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5)
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'flex'
    }
  },
  link: {
    textDecoration: 'none'
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
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
  },
  secoLogo: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
})

class TopBar extends React.Component {
  state = {
    infoAnchorEl: null,
    mobileMoreAnchorEl: null
  };

  handleInfoMenuOpen = event => {
    this.setState({ infoAnchorEl: event.currentTarget })
  };

  handleInfoMenuClose = () => {
    this.setState({ infoAnchorEl: null })
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget })
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null })
  };

  // https://material-ui.com/components/buttons/#third-party-routing-library
  AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);
  AdapterNavLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);

  renderMobileMenuItem = perspective => {
    if (has(perspective, 'externalUrl')) {
      return (
        <a
          className={this.props.classes.link}
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>
            {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </MenuItem>
        </a>
      )
    } else {
      return (
        <MenuItem
          key={perspective.id}
          component={this.AdapterLink}
          to={`/${perspective.id}/faceted-search`}
        >
          {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
        </MenuItem>
      )
    }
  }

  renderDesktopTopMenuItem = perspective => {
    if (has(perspective, 'externalUrl')) {
      return (
        <a
          className={this.props.classes.link}
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
      )
    } else {
      return (
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
      )
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
        to='/feedback'
      >
        {intl.get('topBar.feedback').toUpperCase()}
      </MenuItem>
      <MenuItem
        key={0}
        component={this.AdapterLink}
        to='/about'
      >
        {intl.get('topBar.info.aboutThePortal').toUpperCase()}
      </MenuItem>
      <a
        className={this.props.classes.link}
        key={1}
        href={intl.get('topBar.info.blogUrl')}
        target='_blank'
        rel='noopener noreferrer'
      >
        <MenuItem>
          {intl.get('topBar.info.blog').toUpperCase()}
        </MenuItem>
      </a>
      <MenuItem
        key='info'
        component={this.AdapterLink}
        to='/instructions'
      >
        {intl.get('topBar.instructions').toUpperCase()}
      </MenuItem>
    </Menu>

  render () {
    const { classes, perspectives /* currentLocale, availableLocales */ } = this.props
    return (
      <div className={classes.root}>
        {/* Add an empty Typography element to ensure that that the MuiTypography class is loaded for
         any lower level components that use MuiTypography class only in translation files */}
        <Typography />
        <AppBar position='absolute'>
          <Toolbar className={classes.toolbar}>
            <Button component={this.AdapterLink} to='/'>
              <Typography variant='h6'>{intl.get('appTitle.short')}</Typography>
            </Button>
            <TopBarSearchField
              fetchResultsClientSide={this.props.fetchResultsClientSide}
              clearResults={this.props.clearResults}
              xsScreen={this.props.xsScreen}
            />
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {perspectives.map((perspective, index) => this.renderDesktopTopMenuItem(perspective, index))}
              <div className={classes.appBarDivider} />
              <Button
                className={classes.appBarButton}
                component={this.AdapterNavLink}
                to='/feedback'
                isActive={(match, location) => location.pathname.startsWith('/feedback')}
                activeClassName={this.props.classes.appBarButtonActive}
              >
                {intl.get('topBar.feedback')}
              </Button>
              <TopBarInfoButton />
              <Button
                className={classes.appBarButton}
                component={this.AdapterNavLink}
                to='/instructions'
                isActive={(match, location) => location.pathname.startsWith('/instructions')}
                activeClassName={this.props.classes.appBarButtonActive}
              >
                {intl.get('topBar.instructions')}
              </Button>

              {/* <TopBarLanguageButton
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                loadLocales={this.props.loadLocales}
              /> */}
            </div>
            <a
              className={classes.secoLogo}
              href='https://seco.cs.aalto.fi/projects/mmm'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button><img src={secoLogo} /></Button>
            </a>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMobileMenu(perspectives)}
      </div>
    )
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchResultsClientSide: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  loadLocales: PropTypes.func.isRequired,
  perspectives: PropTypes.array.isRequired,
  currentLocale: PropTypes.string.isRequired,
  availableLocales: PropTypes.array.isRequired,
  xsScreen: PropTypes.bool.isRequired
}

export default withStyles(styles)(TopBar)
