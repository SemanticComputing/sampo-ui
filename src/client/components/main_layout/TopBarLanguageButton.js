import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import withStyles from '@mui/styles/withStyles'
import { Link } from 'react-router-dom'
import history from '../../History'
import { updateLocaleToPathname } from '../../helpers/helpers'

const styles = theme => ({
  link: {
    textDecoration: 'none'
  },
  appBarButton: {
    color: 'white !important',
    border: `1px solid ${theme.palette.primary.main}`
  }
})

class TopBarLanguageButton extends React.Component {
  state = {
    anchorEl: null
  };

  AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };

  handleMenuItemOnClick = locale => () => {
    const { pathname } = this.props.location
    history.push({
      pathname: updateLocaleToPathname({ pathname, locale, replaceOld: true })
    })
    this.props.loadLocales(locale)
    this.handleClose()
  }

  render () {
    const { classes, currentLocale, availableLocales } = this.props
    return (
      <>
        <Button
          className={classes.appBarButton}
          aria-haspopup='true'
          onClick={this.handleOpen}
          endIcon={<ExpandMoreIcon />}
        >
          {currentLocale.toUpperCase()}
        </Button>
        <Menu
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          {availableLocales.map(locale =>
            <MenuItem
              key={locale.id}
              onClick={this.handleMenuItemOnClick(locale.id)}
              selected={this.props.currentLocale === locale.id}
            >
              {locale.label}
            </MenuItem>
          )}
        </Menu>
      </>
    )
  }
}

TopBarLanguageButton.propTypes = {
  classes: PropTypes.object.isRequired,
  currentLocale: PropTypes.string.isRequired,
  availableLocales: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired
}

export default withStyles(styles)(TopBarLanguageButton)
