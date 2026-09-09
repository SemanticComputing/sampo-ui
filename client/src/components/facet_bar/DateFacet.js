import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import DatePicker from '@mui/lab/DatePicker'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import moment from 'moment'
import intl from 'react-intl-universal'

/**
 * A date facet component built on @mui/lab/DatePicker and Moment.js.
 */
class DateFacet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      from: moment(this.props.facet.min),
      to: moment(this.props.facet.max),
      fromError: false,
      toError: false
    }
  }

  handleFromChange = from => {
    this.setState({ from })
    const { to } = this.state
    if (this.isValidDate(from) &&
      this.isValidDate(to) &&
      from.isSameOrBefore(to)) {
      this.setState({ fromError: false })
    } else {
      this.setState({ fromError: true })
    }
  }

  handleToChange = to => {
    this.setState({ to })
    const { from } = this.state
    if (this.isValidDate(from) &&
      this.isValidDate(to) &&
      from.isSameOrBefore(to)) {
      this.setState({ toError: false })
    } else {
      this.setState({ toError: true })
    }
  }

  handleApplyOnClick = () => this.updateFacet()

  updateFacet = () => {
    const { from, to } = this.state
    if (this.isValidDate(from) &&
      this.isValidDate(to) &&
      from.isSameOrBefore(to)) {
      const values = [
        from.format('YYYY-MM-DD'),
        to.format('YYYY-MM-DD')
      ]
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: this.props.facet.filterType,
        value: values
      })
    }
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
    const { from, to, fromError, toError } = this.state
    const { min, max } = this.props.facet
    const { someFacetIsFetching } = this.props
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex'
        }}
      >
        <Box sx={{ width: '160px' }}>
          <DatePicker
            label={intl.get('facets.dateFacet.fromLabel')}
            renderInput={params =>
              <TextField
                error={fromError}
                helperText={fromError ? intl.get('facets.dateFacet.invalidDate') : ' '}
                {...params}
              />}
            placeholder={moment(min).format('DD.MM.YYYY')}
            mask='__.__.____'
            value={from}
            onChange={date => this.handleFromChange(date)}
            inputFormat='DD.MM.YYYY'
            minDate={moment(min)}
            maxDate={moment(max)}
            disabled={someFacetIsFetching}
          />
          <Box
            sx={theme => ({
              marginTop: theme.spacing(1.5)
            })}
          >
            <DatePicker
              label={intl.get('facets.dateFacet.toLabel')}
              renderInput={params =>
                <TextField
                  error={toError}
                  helperText={toError ? intl.get('facets.dateFacet.invalidDate') : ' '}
                  {...params}
                />}
              placeholder={moment(max).format('DD.MM.YYYY')}
              mask='__.__.____'
              value={to}
              onChange={date => this.handleToChange(date)}
              inputFormat='DD.MM.YYYY'
              minDate={moment(min)}
              maxDate={moment(max)}
              disabled={someFacetIsFetching}
            />
          </Box>
        </Box>
        <Box sx={theme => ({
          marginLeft: theme.spacing(1.5),
          paddingTop: '55px'
        })}
        >
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleApplyOnClick}
            disabled={someFacetIsFetching || fromError || toError}
          >
            {intl.get('facetBar.applyFacetSelection')}
          </Button>
        </Box>
      </Box>
    )
  }
}

DateFacet.propTypes = {
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  facetUpdateID: PropTypes.number
}

export default DateFacet
