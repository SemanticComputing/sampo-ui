import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import { ISOStringToYear } from './FacetHelpers'
import { format } from 'date-fns'
import intl from 'react-intl-universal'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing(0.5)
  }
})

/**
 * A component for displaying the active facet selections an array of Material-UI's Chips.
 * Redux is used for keeping track of the selections.
 */
const ChipsArray = props => {
  const handleDelete = item => () => {
    if (!props.someFacetIsFetching && !props.fetchingResultCount) {
      switch (item.filterType) {
        case 'uriFilter':
          props.updateFacetOption({
            facetClass: props.facetClass,
            facetID: item.facetID,
            option: item.filterType,
            value: item.value
          })
          break
        case 'textFilter':
        case 'dateNoTimespanFilter':
          props.updateFacetOption({
            facetClass: props.facetClass,
            facetID: item.facetID,
            option: item.filterType,
            value: null
          })
          break
        case 'timespanFilter':
        case 'integerFilter':
          props.updateFacetOption({
            facetClass: props.facetClass,
            facetID: item.facetID,
            option: item.filterType,
            value: null
          })
          props.fetchFacet({
            facetClass: props.facetClass,
            facetID: item.facetID
          })
      }
    }
  }

  const generateLabel = (facetLabel, valueLabel, filterType) => {
    return filterType !== 'timespanFilter' &&
      filterType !== 'integerFilter' &&
      valueLabel.length > 18
      ? `${facetLabel}: ${valueLabel.substring(0, 18)}...`
      : `${facetLabel}: ${valueLabel}`
  }

  const { classes, data } = props

  return (
    <div className={classes.root}>
      {data !== null && data.map(item => {
        const icon = null
        let key = null
        let valueLabel = null
        if (item.filterType === 'uriFilter') {
          key = item.value.node.id
          valueLabel = item.value.node.prefLabel
        }
        if (item.filterType === 'textFilter') {
          key = item.value
          valueLabel = item.value
        }
        if (item.filterType === 'timespanFilter') {
          key = item.facetID
          valueLabel = `${ISOStringToYear(item.value.start)} to
            ${ISOStringToYear(item.value.end)}`
        }
        if (item.filterType === 'dateNoTimespanFilter') {
          key = item.facetID
          const start = format(new Date(item.value.start), 'dd.MM.yyyy')
          const end = format(new Date(item.value.end), 'dd.MM.yyyy')
          valueLabel = `${start} ${intl.get('facets.dateFacet.to')} ${end}`
        }
        if (item.filterType === 'integerFilter') {
          const { start, end } = item.value
          key = item.facetID
          // valueLabel = `${item.value.start} to ${item.value.end}`;
          valueLabel = `
              ${start !== '' ? start : '-'}
              to ${end !== '' ? end : '-'}`
        }
        return (
          <Tooltip key={key} title={`${item.facetLabel}: ${valueLabel}`}>
            <Chip
              key={key}
              icon={icon}
              label={generateLabel(item.facetLabel, valueLabel, item.filterType)}
              className={classes.chip}
              disabled={props.someFacetIsFetching || props.fetchingResultCount}
              onDelete={handleDelete(item)}
              color='primary'
            />
          </Tooltip>
        )
      })}
    </div>
  )
}

ChipsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  facetClass: PropTypes.string.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchingResultCount: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func.isRequired
}

export const ChipsArrayComponent = ChipsArray

export default withStyles(styles)(ChipsArray)
