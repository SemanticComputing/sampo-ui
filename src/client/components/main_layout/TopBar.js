import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import MoreIcon from '@material-ui/icons/MoreVert'
import Button from '@material-ui/core/Button'
import { Link, NavLink } from 'react-router-dom'
import TopBarSearchField from './TopBarSearchField'
import TopBarInfoButton from './TopBarInfoButton'
import TopBarLanguageButton from './TopBarLanguageButton'
import Divider from '@material-ui/core/Divider'
import { has } from 'lodash'
import secoLogo from '../../img/logos/seco-logo-48x50.png'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  topBarToolbar: props => ({
    minHeight: props.layoutConfig.topBar.reducedHeight,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      minHeight: props.layoutConfig.topBar.defaultHeight
    },
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5)
  }),
  sectionDesktop: props => ({
    display: 'none',
    [theme.breakpoints.up(props.layoutConfig.topBar.mobileMenuBreakpoint)]: {
      display: 'flex'
    }
  }),
  link: {
    textDecoration: 'none'
  },
  sectionMobile: props => ({
    display: 'flex',
    [theme.breakpoints.up(props.layoutConfig.topBar.mobileMenuBreakpoint)]: {
      display: 'none'
    }
  }),
  appBarButton: {
    whiteSpace: 'nowrap',
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
  secoLogo: props => ({
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down(props.layoutConfig.topBar.mobileMenuBreakpoint)]: {
      display: 'none'
    }
  }),
  secoLogoImage: props => ({
    height: 32,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      height: 50
    }
  }),
  mainLogo: props => ({
    height: 23,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      height: 40
    },
    marginRight: theme.spacing(1)
  }),
  mainLogoButtonRoot: {
    paddingLeft: 0,
    [theme.breakpoints.down('xs')]: {
      minWidth: 48
    }
  },
  mainLogoButtonLabel: {
    justifyContent: 'left'
  },
  mainLogoTypography: props => ({
    // set color and background explicitly to keep Google Lighthouse happy
    color: '#fff',
    background: theme.palette.primary.main,
    whiteSpace: 'nowrap',
    textTransform: props.layoutConfig.topBar.logoTextTransform,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem'
    },
    ...(props.layoutConfig.topBar.hideLogoTextOnMobile && {
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    })
  }),
  mobileMenuButton: {
    padding: 12
  }
}))

/**
 * Responsive app bar with a search field, perspective links, info links and a language
 * selector. Based on Material-UI's App Bar component.
 */
const TopBar = props => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const { perspectives, currentLocale, availableLocales, rootUrl, layoutConfig } = props
  const { topBar } = layoutConfig
  const classes = useStyles(props)
  const handleMobileMenuOpen = event => setMobileMoreAnchorEl(event.currentTarget)
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null)
  const clientFSMode = props.location.pathname.indexOf('clientFS') !== -1
  let showSearchField = true
  if (has(layoutConfig.topBar, 'showSearchField')) {
    showSearchField = layoutConfig.topBar.showSearchField
  }

  // https://material-ui.com/components/buttons/#third-party-routing-library
  const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)
  const AdapterNavLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />)

  const getInternalLink = perspective => {
    const searchMode = has(perspective, 'searchMode') ? perspective.searchMode : 'faceted-search'
    let link = null
    if (searchMode === 'dummy-internal') {
      link = `${props.rootUrl}${perspective.internalLink}`
    }
    if (searchMode !== 'dummy-internal') {
      link = `${props.rootUrl}/${perspective.id}/${searchMode}`
    }
    return link
  }

  const renderMobileMenuItem = perspective => {
    if (has(perspective, 'externalUrl')) {
      return (
        <a
          className={classes.link}
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>
            {perspective.label
              ? perspective.label.toUpperCase()
              : intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </MenuItem>
        </a>
      )
    } else {
      return (
        <MenuItem
          key={perspective.id}
          component={AdapterLink}
          to={getInternalLink(perspective)}
          onClick={handleMobileMenuClose}
        >
          {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
        </MenuItem>
      )
    }
  }

  const renderDesktopTopMenuItem = perspective => {
    if (has(perspective, 'externalUrl')) {
      return (
        <a
          className={classes.link}
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button
            className={classes.appBarButton}
          >
            {perspective.label
              ? perspective.label
              : intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </Button>
        </a>
      )
    } else {
      return (
        <Button
          key={perspective.id}
          className={classes.appBarButton}
          component={AdapterNavLink}
          to={getInternalLink(perspective)}
          isActive={(match, location) => location.pathname.startsWith(`${props.rootUrl}/${perspective.id}`)}
          activeClassName={classes.appBarButtonActive}
        >
          {intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
        </Button>
      )
    }
  }

  const renderInfoItem = item => {
    let jsx
    if (item.externalLink) {
      jsx = (
        <a
          className={classes.link}
          key={item.id}
          href={intl.get(`topBar.info.${item.translatedUrl}`)}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem onClick={handleMobileMenuClose}>
            {intl.get(`topBar.info.${item.translatedText}`).toUpperCase()}
          </MenuItem>
        </a>
      )
    } else {
      jsx = (
        <MenuItem
          key={item.id}
          component={AdapterLink}
          to={`${props.rootUrl}${item.internalLink}`}
          onClick={handleMobileMenuClose}
        >
          {intl.get(`topBar.info.${item.translatedText}`).toUpperCase()}
        </MenuItem>
      )
    }
    return jsx
  }

  const renderMobileMenu = perspectives => {
    const { infoDropdown } = props.layoutConfig.topBar
    return (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        {perspectives.map(perspective => perspective.hideTopPerspectiveButton ? null : renderMobileMenuItem(perspective))}
        <Divider />
        {renderMobileMenuItem({
          id: 'feedback',
          externalUrl: props.layoutConfig.topBar.feedbackLink,
          label: intl.get('topBar.feedback')
        })}
        {infoDropdown.map(item => renderInfoItem(item))}
        {topBar.externalInstructions && renderMobileMenuItem({
          id: 'instructions',
          externalUrl: intl.get('topBar.instructionsUrl'),
          label: intl.get('topBar.instructions')
        })}
        {!topBar.externalInstructions &&
          <Button
            className={classes.appBarButton}
            component={AdapterNavLink}
            to={`${props.rootUrl}/instructions`}
            isActive={(match, location) => location.pathname.startsWith(`${props.rootUrl}/instructions`)}
            activeClassName={classes.appBarButtonActive}
          >
            {intl.get('topBar.instructions')}
          </Button>}
      </Menu>
    )
  }

  return (
    <div className={classes.root}>
      {/* Add an empty Typography element to ensure that that the MuiTypography class is loaded for
         any lower level components that use MuiTypography class only in translation files */}
      <Typography />
      <AppBar position='static'>
        <Toolbar className={classes.topBarToolbar}>
          <Button
            component={AdapterLink} to='/'
            classes={{
              root: classes.mainLogoButtonRoot,
              label: classes.mainLogoButtonLabel
            }}
            onClick={() => clientFSMode ? props.clientFSClearResults() : null}
          >
            {topBar.logoImage &&
              <img
                className={classes.mainLogo}
                src={topBar.logoImage}
                alt={`${intl.get('appTitle.short')} logo`}
              />}
            <Typography className={classes.mainLogoTypography} variant='h5'>
              {props.xsScreen ? intl.get('appTitle.mobile') : intl.get('appTitle.short')}
            </Typography>
          </Button>
          {showSearchField &&
            <TopBarSearchField
              fetchFullTextResults={props.fetchFullTextResults}
              clearResults={props.clearResults}
              xsScreen={props.xsScreen}
              rootUrl={rootUrl}
            />}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {perspectives.map((perspective, index) => perspective.hideTopPerspectiveButton ? null : renderDesktopTopMenuItem(perspective, index))}
            <div className={classes.appBarDivider} />
            {renderDesktopTopMenuItem({
              id: 'feedback',
              externalUrl: props.layoutConfig.topBar.feedbackLink,
              label: intl.get('topBar.feedback')
            })}
            <TopBarInfoButton rootUrl={props.rootUrl} layoutConfig={layoutConfig} />
            {topBar.externalInstructions && renderDesktopTopMenuItem({
              id: 'instructions',
              externalUrl: intl.get('topBar.instructionsUrl'),
              label: intl.get('topBar.instructions')
            })}
            {!topBar.externalInstructions &&
              <Button
                className={classes.appBarButton}
                component={AdapterNavLink}
                to={`${props.rootUrl}/instructions`}
                isActive={(match, location) => location.pathname.startsWith(`${props.rootUrl}/instructions`)}
                activeClassName={classes.appBarButtonActive}
              >
                {intl.get('topBar.instructions')}
              </Button>}
            {props.layoutConfig.topBar.showLanguageButton &&
              <TopBarLanguageButton
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                loadLocales={props.loadLocales}
                location={props.location}
              />}
          </div>
          <a
            className={classes.secoLogo}
            href='https://seco.cs.aalto.fi'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button aria-label='link to Semantic Computing research group homepage'>
              <img
                className={classes.secoLogoImage}
                src={secoLogo}
                alt='Semantic Computing research group logo'
              />
            </Button>
          </a>
          <div className={classes.sectionMobile}>
            {props.layoutConfig.topBar.showLanguageButton &&
              <TopBarLanguageButton
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                loadLocales={props.loadLocales}
                location={props.location}
              />}
            <IconButton
              aria-label='display more actions' color='inherit'
              className={classes.mobileMenuButton}
              onClick={handleMobileMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu(perspectives)}
    </div>
  )
}

TopBar.propTypes = {
  /**
   * Redux action for full text search results using the search field.
   */
  fetchFullTextResults: PropTypes.func.isRequired,
  /**
   * Redux action for clearing the full text results.
   */
  clearResults: PropTypes.func.isRequired,
  /**
   * Redux action for loading translations.
   */
  loadLocales: PropTypes.func.isRequired,
  /**
   * Current locale as a two-letter code
   */
  currentLocale: PropTypes.string.isRequired,
  /**
   * Available locales as an array of objects with two-letter codes as keys.
   */
  availableLocales: PropTypes.array.isRequired,
  /**
   * Perspective config as an array of objects.
   */
  perspectives: PropTypes.array.isRequired,
  /**
   * Flag for checking if the screen is extra small.
   */
  xsScreen: PropTypes.bool.isRequired,
  /**
   * React Router's location object. The perspective links are highlighted based on this.
   */
  location: PropTypes.object.isRequired,
  /**
   * Root url of the application.
   */
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default TopBar
