import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'

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
        <IconButton
          aria-label={placeholder}
        >
          <CircularProgress size={24} />
        </IconButton>
      )
    } else {
      searchButton = (
        <IconButton
          aria-label={placeholder}
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
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
