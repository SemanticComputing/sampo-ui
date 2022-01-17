import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import intl from 'react-intl-universal'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'

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
      this.props.fetchResults({
        perspectiveID: this.props.perspectiveID,
        jenaIndex: 'text',
        query: this.state.value
      })
    }
  };

  handleClick = () => {
    if (this.hasDatasets() && this.hasValidQuery()) {
      this.props.clearResults()
      this.props.updateQuery(this.state.value)
      this.props.fetchResults({
        perspectiveID: this.props.perspectiveID,
        jenaIndex: 'text',
        query: this.state.value
      })
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
        <IconButton aria-label='Search places' size="large">
          <CircularProgress size={24} />
        </IconButton>
      )
    } else {
      searchButton = (
        <IconButton
          aria-label='Search'
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          size="large">
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
