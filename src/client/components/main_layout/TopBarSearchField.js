import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles/colorManipulator'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
// import CircularProgress from '@material-ui/core/CircularProgress';
import history from '../../History'

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    // marginRight: theme.spacing(3),
    // marginLeft: theme.spacing(2.5),
    width: '100%',
    maxWidth: 300,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  }
})

/**
 * A search field that can be embedded into the TopBar.
 */
class TopBarSearchField extends React.Component {
  state = {
    value: ''
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  };

  handleMouseDown = (event) => {
    event.preventDefault()
  };

  handleOnKeyDown = (event) => {
    if (event.key === 'Enter' && this.hasValidQuery()) {
      this.props.clearResults({ resultClass: 'fullTextSearch' })
      this.props.fetchFullTextResults({
        resultClass: 'fullTextSearch',
        query: this.state.value
      })
      history.push({ pathname: `${this.props.rootUrl}/full-text-search/table` })
    }
  };

  handleClick = () => {
    if (this.hasValidQuery()) {
      this.props.clearResults({ resultClass: 'fullTextSearch' })
      this.props.fetchFullTextResults({
        resultClass: 'fullTextSearch',
        query: this.state.value
      })
    }
  };

  hasValidQuery = () => {
    return this.state.value.length > 2
  }

  render () {
    const { classes, xsScreen } = this.props
    const placeholder = xsScreen ? intl.get('topBar.searchBarPlaceHolderShort') : intl.get('topBar.searchBarPlaceHolder')
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder={placeholder}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={this.handleChange}
          onKeyDown={this.handleOnKeyDown}
        />
      </div>
    )
  }
}

TopBarSearchField.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFullTextResults: PropTypes.func,
  xsScreen: PropTypes.bool.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export const TopBarSearchFieldComponent = TopBarSearchField

export default withStyles(styles)(TopBarSearchField)
