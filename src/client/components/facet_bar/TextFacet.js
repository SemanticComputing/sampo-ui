import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import withStyles from '@mui/styles/withStyles'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'

const styles = theme => ({
  textSearch: {
    margin: theme.spacing(1)
  }
})

class TextFacet extends React.Component {
  state = {
    value: ''
  };

  // componentDidUpdate = prevProps => {
  //   if (prevProps.search.query != this.props.search.query) {
  //     this.setState({
  //       value: this.props.search.query
  //     });
  //   }
  // }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  };

  handleMouseDown = (event) => {
    event.preventDefault()
  };

  handleOnKeyDown = event => {
    if (event.key === 'Enter' && this.hasValidQuery()) {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: this.props.facet.filterType,
        value: this.state.value
      })
    }
  };

  handleClick = () => {
    if (this.hasValidQuery()) {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: this.props.facet.filterType,
        value: this.state.value
      })
    }
  };

  hasValidQuery = () => {
    return this.state.value.length > 2
  }

  render () {
    const { classes, facetClass, facetID } = this.props
    const placeholder = intl.get(`perspectives.${facetClass}.properties.${facetID}.textFacetInputPlaceholder`)
    let searchButton = null
    const textResultsFetching = false
    if (textResultsFetching) {
      searchButton = (
        <IconButton aria-label={placeholder} size='large'>
          <CircularProgress size={24} />
        </IconButton>
      )
    } else {
      searchButton = (
        <IconButton
          aria-label='search'
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          size='large'
        >
          <SearchIcon />
        </IconButton>
      )
    }

    return (
      <div className={classes.root}>
        <FormControl className={classes.textSearch}>
          <InputLabel htmlFor='adornment-search'>{placeholder}</InputLabel>
          <Input
            id='adornment-search'
            type='text'
            aria-label='search'
            value={this.state.value}
            disabled={this.props.someFacetIsFetching}
            onChange={this.handleChange}
            onKeyDown={this.handleOnKeyDown}
            endAdornment={
              <InputAdornment position='end'>
                {searchButton}
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    )
  }
}

TextFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  facetUpdateID: PropTypes.number
}

export const TextFacetComponent = TextFacet

export default withStyles(styles)(TextFacet)
