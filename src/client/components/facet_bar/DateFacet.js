import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import { KeyboardDatePicker } from '@material-ui/pickers'
import moment from 'moment'
import intl from 'react-intl-universal'
import FormHelperText from '@mui/material/FormHelperText'
import classNames from 'classnames'

const styles = theme => ({
  datePicker: {
    width: 140
  },
  from: {
    marginRight: theme.spacing(3)
  }
})

/**
 * A component for a date facet with pickers using @material-ui/pickers and Moment.js.
 */
class DateFacet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      from: moment(this.props.facet.min),
      to: moment(this.props.facet.max)
    }
  }

  handleFromChange = from => {
    this.setState({ from })
    const { to } = this.state
    if (this.isValidDate(from) &&
      this.isValidDate(to) &&
      from.isSameOrBefore(to)) {
      const values = [
        from.format('YYYY-MM-DD'),
        to.format('YYYY-MM-DD')
      ]
      this.updateFacet(values)
    }
  }

  handleToChange = to => {
    this.setState({ to })
    const { from } = this.state
    if (this.isValidDate(from) &&
      this.isValidDate(to) &&
      from.isSameOrBefore(to)) {
      const values = [
        this.state.from.format('YYYY-MM-DD'),
        to.format('YYYY-MM-DD')
      ]
      this.updateFacet(values)
    }
  }

  updateFacet = values => {
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: values
    })
  }

  isValidDate = date => {
    const momentMin = moment(this.props.facet.min)
    const momentMax = moment(this.props.facet.max)
    return date &&
      date.isValid() &&
      date.isSameOrAfter(momentMin) &&
      date.isSameOrBefore(momentMax)
  }

  render () {
    const { from, to } = this.state
    const { min, max } = this.props.facet
    const { classes, someFacetIsFetching } = this.props
    const showCustomError = this.isValidDate(from) &&
      this.isValidDate(to) &&
      !from.isSameOrBefore(to)
    return (
      <div>
        <KeyboardDatePicker
          className={classNames(classes.datePicker, classes.from)}
          label={intl.get('facets.dateFacet.fromLabel')}
          placeholder={moment(min).format('DD.MM.YYYY')}
          value={from}
          onChange={date => this.handleFromChange(date)}
          format='DD.MM.YYYY'
          minDate={min}
          maxDate={max}
          invalidDateMessage={intl.get('facets.dateFacet.invalidDate')}
          minDateMessage={intl.get('facets.dateFacet.minDate', { minDate: moment(min).format('DD.MM.YYYY') })}
          maxDateMessage={intl.get('facets.dateFacet.maxDate', { maxDate: moment(max).format('DD.MM.YYYY') })}
          cancelLabel={intl.get('facets.dateFacet.cancel')}
          shouldDisableDate={date => date.isAfter(to)}
          disabled={someFacetIsFetching}
        />
        <KeyboardDatePicker
          className={classes.datePicker}
          label={intl.get('facets.dateFacet.toLabel')}
          placeholder={moment(max).format('DD.MM.YYYY')}
          value={to}
          onChange={date => this.handleToChange(date)}
          format='DD.MM.YYYY'
          minDate={min}
          maxDate={max}
          invalidDateMessage={intl.get('facets.dateFacet.invalidDate')}
          minDateMessage={intl.get('facets.dateFacet.minDate', { minDate: moment(min).format('DD.MM.YYYY') })}
          maxDateMessage={intl.get('facets.dateFacet.maxDate', { maxDate: moment(max).format('DD.MM.YYYY') })}
          cancelLabel={intl.get('facets.dateFacet.cancel')}
          shouldDisableDate={date => date.isBefore(from)}
          disabled={someFacetIsFetching}
        />
        {showCustomError && <FormHelperText error>{intl.get('facets.dateFacet.toBeforeFrom')}</FormHelperText>}
      </div>
    )
  }
}

DateFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  facetUpdateID: PropTypes.number
}

export const DateFacetComponent = DateFacet

export default withStyles(styles)(DateFacet)
