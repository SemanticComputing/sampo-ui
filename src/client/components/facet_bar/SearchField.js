import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5)
  },
  textSearch: {
    margin: theme.spacing(1)
  }
})

/**
 * A component for text search in client-side faceted search architecture.
 */
class SearchField extends React.Component {
  state = {
    value: ''
  };

  componentDidUpdate = prevProps => {
    if (prevProps.search.query !== this.props.search.query) {
      this.setState({
        value: this.props.search.query
      })
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  };

  handleMouseDown = (event) => {
    event.preventDefault()
  };

  handleOnKeyDown = (event) => {
    if (event.key === 'Enter' && this.hasDatasets() && this.hasValidQuery()) {
      this.props.clearResults()
      this.props.updateQuery(this.state.value)
      this.props.fetchResults({ jenaIndex: 'text', query: this.state.value })
    }
  };

  handleClick = () => {
    if (this.hasDatasets() && this.hasValidQuery()) {
      this.props.clearResults()
      this.props.updateQuery(this.state.value)
      this.props.fetchResults({ jenaIndex: 'text', query: this.state.value })
    }
  };

  hasDatasets = () => {
    let hasDs = false
    Object.values(this.props.datasets).forEach(value => {
      if (value.selected) {
        hasDs = true
      }
    })
    return hasDs
  }

  hasValidQuery = () => {
    return this.state.value.length > 2
  }

  render () {
    const { classes } = this.props
    let searchButton = null
    if (this.props.search.textResultsFetching) {
      searchButton = (
        <IconButton
          aria-label='Search places'
        >
          <CircularProgress size={24} />
        </IconButton>
      )
    } else {
      searchButton = (
        <IconButton
          aria-label='Search'
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
        >
          <SearchIcon />
        </IconButton>
      )
    }

    return (
      <Paper className={classes.root}>
        <FormControl className={classes.textSearch}>
          <InputLabel htmlFor='adornment-search'>{intl.get(`perspectives.${this.props.perspectiveID}.inputPlaceHolder`)}</InputLabel>
          <Input
            id='adornment-search'
            type='text'
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleOnKeyDown}
            endAdornment={
              <InputAdornment position='end'>
                {searchButton}
              </InputAdornment>
            }
          />
        </FormControl>
      </Paper>
    )
  }
}

SearchField.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  datasets: PropTypes.object.isRequired,
  perspectiveID: PropTypes.string.isRequired
}

export const SearchFieldComponent = SearchField

export default withStyles(styles)(SearchField)
