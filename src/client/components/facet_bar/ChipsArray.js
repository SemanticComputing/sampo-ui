import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import { ISOStringToYear } from './FacetHelpers'

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

const ChipsArray = props => {
  const handleDelete = item => () => {
    if (!props.someFacetIsFetching) {
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
  fetchFacet: PropTypes.func.isRequired
}

export const ChipsArrayComponent = ChipsArray

export default withStyles(styles)(ChipsArray)
