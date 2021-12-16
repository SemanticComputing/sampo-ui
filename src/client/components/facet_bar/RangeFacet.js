import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { has } from 'lodash'

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex'
  },
  textFields: {
    marginRight: theme.spacing(2),
    maxWidth: 150
  },
  textField: {
    display: 'block'
  },
  applyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(1.5)
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

/**
 * A component for a integer range facet.
 */
class RangeFacet extends Component {
  constructor (props) {
    super(props)
    let min = ''
    let max = ''
    const { facet } = props
    if (has(facet, 'integerFilter') && facet.integerFilter !== null) {
      const { integerFilter } = facet
      min = integerFilter.start
      max = integerFilter.end
    }
    this.state = { min, max }
  }

  componentDidMount = () => {
    let min = ''
    let max = ''
    const { facet } = this.props
    if (has(facet, 'integerFilter') && facet.integerFilter !== null) {
      const { integerFilter } = facet
      min = integerFilter.start
      max = integerFilter.end
    }
    this.setState({ min, max })
  }

  handleMinChange = event => {
    this.setState({ min: event.target.value })
  }

  handleMaxChange = event => {
    this.setState({ max: event.target.value })
  }

  handleApplyOnClick = event => {
    const { min, max } = this.state
    const values = [min, max]
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: values
    })
    event.preventDefault()
  }

  disableApply = () => {
    let disabled = false
    if (this.props.someFacetIsFetching) {
      disabled = true
    }
    if (this.state.min === '' && this.state.max === '') {
      disabled = true
    }
    return disabled
  }

  render () {
    const { classes, someFacetIsFetching } = this.props
    const { isFetching, unit } = this.props.facet
    if (isFetching) {
      return (
        <div className={classes.spinnerContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      )
    } else {
      return (
        <div className={classes.root}>
          <div className={classes.textFields}>
            <TextField
              id='standard-number'
              label='Min'
              disabled={someFacetIsFetching}
              value={this.state.min}
              onChange={this.handleMinChange}
              type='number'
              variant='outlined'
              className={classes.textField}
              InputProps={{
                endAdornment: <InputAdornment position='end'>{unit}</InputAdornment>
              }}
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
            <TextField
              id='standard-number'
              label='Max'
              disabled={someFacetIsFetching}
              value={this.state.max}
              onChange={this.handleMaxChange}
              type='number'
              variant='outlined'
              className={classes.textField}
              InputProps={{
                endAdornment: <InputAdornment position='end'>{unit}</InputAdornment>
              }}
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
          </div>
          <div className={classes.applyButton}>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={this.handleApplyOnClick}
              disabled={this.disableApply()}
            >
              apply
            </Button>
          </div>
        </div>
      )
    }
  }
}

RangeFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  facetUpdateID: PropTypes.number,
  updatedFilter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updatedFacet: PropTypes.string
}

export const RangeFacetComponent = RangeFacet

export default withStyles(styles)(RangeFacet)
