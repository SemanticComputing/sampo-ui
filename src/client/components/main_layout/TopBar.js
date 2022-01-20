import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Link, NavLink } from 'react-router-dom'
import TopBarSearchField from './TopBarSearchField'
import TopBarInfoButton from './TopBarInfoButton'
import TopBarLanguageButton from './TopBarLanguageButton'
import Divider from '@mui/material/Divider'
import { has } from 'lodash'
import secoLogo from '../../img/logos/seco-logo-48x50.png'

/**
 * Responsive app bar with a search field, perspective links, info links and a language
 * selector. Based on Material-UI's App Bar component.
 */
const TopBar = props => {
  const theme = useTheme()
  // custom style function for utilizing React Router's isActive prop
  const createAppBarButtonStyle = isActive => ({
    whiteSpace: 'nowrap',
    color: '#fff',
    border: isActive ? '1px solid #fff' : `1px solid ${theme.palette.primary.main}`
  })
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const { perspectives, currentLocale, availableLocales, rootUrl, layoutConfig } = props
  const { topBar } = layoutConfig
  const handleMobileMenuOpen = event => setMobileMoreAnchorEl(event.currentTarget)
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null)
  const federatedSearchMode = props.location.pathname.indexOf('federated-search') !== -1
  let showSearchField = true
  if (has(layoutConfig.topBar, 'showSearchField')) {
    showSearchField = layoutConfig.topBar.showSearchField
  }

  // https://mui.com/guides/routing/#button
  const AdapterLink = React.forwardRef((props, ref) =>
    <Link ref={ref} {...props} role={undefined} />)
  const AdapterNavLink = React.forwardRef((props, ref) =>
    <NavLink ref={ref} {...props} role={undefined} />)

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
        <Box
          component='a'
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            textDecoration: 'none'
          }}
        >
          <MenuItem>
            {perspective.label
              ? perspective.label.toUpperCase()
              : intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </MenuItem>
        </Box>
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
        <Box
          component='a'
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            textDecoration: 'none'
          }}
        >
          <Button
            sx={createAppBarButtonStyle(false)}
          >
            {perspective.label
              ? perspective.label
              : intl.get(`perspectives.${perspective.id}.label`).toUpperCase()}
          </Button>
        </Box>
      )
    } else {
      return (
        <Button
          key={perspective.id}
          component={AdapterNavLink}
          to={getInternalLink(perspective)}
          isActive={(match, location) => location.pathname.startsWith(`${props.rootUrl}/${perspective.id}`)}
          style={isActive => createAppBarButtonStyle(isActive)}
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
        <Box
          key={item.id}
          href={intl.get(`topBar.info.${item.translatedUrl}`)}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            textDecoration: 'none'
          }}
        >
          <MenuItem onClick={handleMobileMenuClose}>
            {intl.get(`topBar.info.${item.translatedText}`).toUpperCase()}
          </MenuItem>
        </Box>
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
    const { topBar } = props.layoutConfig
    const { infoDropdown } = topBar
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
          <MenuItem
            key='instructions'
            component={AdapterLink}
            to={`${props.rootUrl}/instructions`}
            onClick={handleMobileMenuClose}
          >
            {intl.get('topBar.instructions').toUpperCase()}
          </MenuItem>}
      </Menu>
    )
  }

  return (
    <>
      <AppBar position='static'>
        <Toolbar
          disableGutters
          sx={theme => ({
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5)
          })}
        >
          <Button
            sx={theme => ({
              paddingLeft: 0,
              [theme.breakpoints.down('sm')]: {
                minWidth: 48
              }
            })}
            component={AdapterLink} to='/'
            onClick={() => federatedSearchMode ? props.clientFSClearResults() : null}
          >
            {topBar.logoImage &&
              <Box
                component='img'
                src={topBar.logoImage}
                alt={`${intl.get('appTitle.short')} logo`}
                sx={theme => ({
                  height: props.layoutConfig.topBar.logoImageReducedHeight || 23,
                  [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
                    height: props.layoutConfig.topBar.logoImageHeight || 40
                  },
                  marginRight: theme.spacing(1)
                })}
              />}
            {!topBar.hideLogoText &&
              <Typography
                sx={theme => ({
                  color: '#fff',
                  background: theme.palette.primary.main,
                  whiteSpace: 'nowrap',
                  textTransform: props.layoutConfig.topBar.logoTextTransform,
                  [theme.breakpoints.down('md')]: {
                    fontSize: '1.5rem'
                  },
                  ...(props.layoutConfig.topBar.hideLogoTextOnMobile && {
                    [theme.breakpoints.down('sm')]: {
                      display: 'none'
                    }
                  })
                })}
                variant='h5'
              >
                {props.screenSize === 'xs' ? intl.get('appTitle.mobile') : intl.get('appTitle.short')}
              </Typography>}
          </Button>
          {topBar.logoImageSecondary &&
            <a
              href={topBar.logoImageSecondaryLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button>
                <Box
                  component='img'
                  src={topBar.logoImageSecondary}
                  alt='logoSecondary'
                  sx={theme => ({
                    height: 26,
                    [theme.breakpoints.up('sm')]: {
                      height: 32
                    },
                    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
                      height: 52
                    }
                  })}
                />
              </Button>
            </a>}
          {showSearchField &&
            <TopBarSearchField
              fetchFullTextResults={props.fetchFullTextResults}
              clearResults={props.clearResults}
              screenSize={props.screenSize}
              rootUrl={rootUrl}
            />}
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={theme => ({
              display: 'none',
              [theme.breakpoints.up(props.layoutConfig.topBar.mobileMenuBreakpoint)]: {
                display: 'flex'
              }
            })}
          >
            {perspectives.map((perspective, index) => perspective.hideTopPerspectiveButton ? null : renderDesktopTopMenuItem(perspective, index))}
            <Box
              sx={theme => ({
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                borderLeft: '2px solid white'
              })}
            />
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
                component={AdapterNavLink}
                to={`${props.rootUrl}/instructions`}
                isActive={(match, location) => location.pathname.startsWith(`${props.rootUrl}/instructions`)}
                style={isActive => createAppBarButtonStyle(isActive)}
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
          </Box>
          <Box
            component='a'
            href='https://seco.cs.aalto.fi'
            target='_blank'
            rel='noopener noreferrer'
            sx={theme => ({
              marginLeft: theme.spacing(1),
              [theme.breakpoints.down(props.layoutConfig.topBar.mobileMenuBreakpoint)]: {
                display: 'none'
              }
            })}
          >
            <Button aria-label='link to Semantic Computing research group homepage'>
              <Box
                component='img'
                src={secoLogo}
                alt='Semantic Computing research group logo'
                sx={theme => ({
                  height: 32,
                  [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
                    height: 50
                  }
                })}
              />
            </Button>
          </Box>
          <Box
            sx={theme => ({
              display: 'flex',
              [theme.breakpoints.up(props.layoutConfig.topBar.mobileMenuBreakpoint)]: {
                display: 'none'
              }
            })}
          >
            {props.layoutConfig.topBar.showLanguageButton &&
              <TopBarLanguageButton
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                loadLocales={props.loadLocales}
                location={props.location}
              />}
            <IconButton
              aria-label='display more actions'
              color='inherit'
              edge='end'
              onClick={handleMobileMenuOpen}
              size='large'
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu(perspectives)}
    </>
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
  screenSize: PropTypes.string.isRequired,
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
