import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import { withStyles } from '@material-ui/core/styles'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { Handle, Track, Tick, TooltipRail } from './SliderComponents'
import { YearToISOString, ISOStringToYear } from './FacetHelpers'

const sliderRootStyle = {
  position: 'relative',
  width: '100%'
}

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
  componentDidMount = () => {
    const { isFetching, min, max } = this.props.facet
    if (!isFetching && (min == null || max == null)) {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
    }
  }

  handleSliderOnChange = values => {
    if (this.props.dataType === 'ISOString') {
      values[0] = YearToISOString({ year: values[0], start: true })
      values[1] = YearToISOString({ year: values[1], start: false })
    }
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: values
    })
  }

  render () {
    const { classes, someFacetIsFetching } = this.props
    const { isFetching, min, max } = this.props.facet
    let domain = null
    let values = null
    if (isFetching || min == null || max == null) {
      return (
        <div className={classes.spinnerContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      )
    } else {
      if (this.props.dataType === 'ISOString') {
        const minYear = ISOStringToYear(min)
        const maxYear = ISOStringToYear(max)
        domain = [minYear, maxYear]
        if (this.props.facet.timespanFilter == null) {
          values = domain
        } else {
          const { start, end } = this.props.facet.timespanFilter
          values = [ISOStringToYear(start), ISOStringToYear(end)]
        }
      } else if (this.props.dataType === 'integer') {
        domain = [parseInt(min), parseInt(max)]
        if (this.props.facet.integerFilter == null) {
          values = domain
        } else {
          const { start, end } = this.props.facet.integerFilter
          values = [start, end]
        }
      }

      // Slider documentation: https://github.com/sghall/react-compound-slider
      return (
        <div className={classes.root}>
          <Slider
            mode={1}
            step={1}
            domain={domain}
            disabled={someFacetIsFetching}
            reversed={false}
            rootStyle={sliderRootStyle}
            onChange={this.handleSliderOnChange}
            values={values}
          >
            <Rail>{railProps => <TooltipRail {...railProps} />}</Rail>
            <Handles>
              {({ handles, activeHandleID, getHandleProps }) => (
                <div className='slider-handles'>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={domain}
                      isActive={handle.id === activeHandleID}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks left={false} right={false}>
              {({ tracks, getTrackProps }) => (
                <div className='slider-tracks'>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
            <Ticks count={10}>
              {({ ticks }) => (
                <div className='slider-ticks'>
                  {ticks.map(tick => (
                    <Tick key={tick.id} tick={tick} count={ticks.length} />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      )
    }
  }
}

SliderFacet.propTypes = {
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
  updatedFacet: PropTypes.string,
  dataType: PropTypes.string.isRequired
}

export const SliderFacetComponent = SliderFacet

export default withStyles(styles)(SliderFacet)
