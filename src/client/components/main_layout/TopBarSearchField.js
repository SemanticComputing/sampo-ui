import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import history from '../../History'

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
    const { xsScreen } = this.props
    const placeholder = xsScreen
      ? intl.get('topBar.searchBarPlaceHolderShort')
      : intl.get('topBar.searchBarPlaceHolder')
    return (
      <Box
        sx={theme => ({
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25)
          },
          marginRight: theme.spacing(2),
          marginLeft: 0,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
          }
        })}
      >
        <Box
          sx={theme => ({
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <SearchIcon />
        </Box>
        <InputBase
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search' }}
          onChange={this.handleChange}
          onKeyDown={this.handleOnKeyDown}
          sx={theme => ({
            color: 'inherit',
            '& .MuiInputBase-input': {
              padding: theme.spacing(1, 1, 1, 0),
              // vertical padding + font size from searchIcon
              paddingLeft: `calc(1em + ${theme.spacing(4)})`,
              transition: theme.transitions.create('width'),
              width: '100%',
              [theme.breakpoints.up('md')]: {
                width: '20ch'
              }
            }
          })}
        />
      </Box>
    )
  }
}

TopBarSearchField.propTypes = {
  fetchFullTextResults: PropTypes.func,
  xsScreen: PropTypes.bool.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export const TopBarSearchFieldComponent = TopBarSearchField

export default TopBarSearchField
