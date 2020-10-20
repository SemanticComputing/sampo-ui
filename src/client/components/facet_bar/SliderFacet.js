import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import { withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import { YearToISOString, ISOStringToYear } from './FacetHelpers'

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
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
* A component for a slider range facet.
*/
class SliderFacet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      min: null,
      max: null,
      values: null
    }
  }

  componentDidMount = () => {
    this.props.fetchFacet({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID
    })
  }

  componentDidUpdate = prevProps => {
    if (prevProps.facet.min !== this.props.facet.min ||
      prevProps.facetFilter !== this.props.facetFilter ||
      (prevProps.facet.isFetching && !this.props.facet.isFetching)) {
      let domain = null
      let values = null
      const { min, max } = this.props.facet
      if (this.props.dataType === 'ISOString') {
        const minYear = ISOStringToYear(min)
        const maxYear = ISOStringToYear(max)
        domain = [minYear, maxYear]
        if (this.props.facetFilter == null) {
          values = domain
        } else {
          const { start, end } = this.props.facetFilter
          values = [ISOStringToYear(start), ISOStringToYear(end)]
        }
      } else if (this.props.dataType === 'integer') {
        domain = [parseInt(min), parseInt(max)]
        if (this.props.facetFilter == null) {
          values = domain
        } else {
          const { start, end } = this.props.facetFilter
          values = [start, end]
        }
      }
      this.setState({
        min: domain[0],
        max: domain[1],
        values
      })
    }
  }

  handleSliderOnChange = (event, newValues) => {
    this.setState({ values: newValues })
  }

  handleSliderOnChangeCommitted = (event, newValues) => {
    let facetValues = []
    if (this.props.dataType === 'ISOString') {
      facetValues[0] = YearToISOString({ year: newValues[0], start: true })
      facetValues[1] = YearToISOString({ year: newValues[1], start: false })
    } else {
      facetValues = newValues
    }
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: facetValues
    })
  }

  render () {
    const { min, max, values } = this.state
    const { classes, someFacetIsFetching } = this.props
    const { isFetching } = this.props.facet
    if (isFetching) {
      return (
        <div className={classes.spinnerContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      )
    }
    return (
      <div className={classes.root}>
        <Slider
          min={min}
          max={max}
          value={values}
          onChange={this.handleSliderOnChange}
          onChangeCommitted={this.handleSliderOnChangeCommitted}
          valueLabelDisplay='on'
          aria-labelledby='range-slider'
          disabled={someFacetIsFetching}
        />
      </div>
    )
  }
}

SliderFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetFilter: PropTypes.object,
  facetClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  dataType: PropTypes.oneOf(['ISOString', 'integer']).isRequired
}

export const SliderFacetComponent = SliderFacet

export default withStyles(styles)(SliderFacet)
