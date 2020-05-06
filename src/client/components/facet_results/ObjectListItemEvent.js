import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ObjectListItemLink from './ObjectListItemLink'

const styles = () => ({
  dateContainer: {
    width: 180,
    display: 'inline-block'
  }
})

/**
  A component for displaying an event with or without a date in an ObjectListCollapsible.
 */
const ObjectListItemEvent = props => {
  const { data, isFirstValue } = props
  const label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel
  return (
    <>
      <span className={isFirstValue ? null : props.classes.dateContainer}>
        {data.date == null ? 'No date ' : `${data.date} `}
      </span>
      <ObjectListItemLink
        data={data}
        label={label}
        externalLink={false}
      />
      {data.observedOwner &&
        <>
          {': '}
          <ObjectListItemLink
            data={data.observedOwner}
            label={data.observedOwner.prefLabel}
            externalLink={false}
          />
        </>}
    </>
  )
}

ObjectListItemEvent.propTypes = {
  /**
   * Material-UI styles
   */
  classes: PropTypes.object,
  /**
   * An object with the following keys: id, prefLabel, date, dataProviderUrl.
   */
  data: PropTypes.object,
  /**
   * The first item in a ObjectListCollapsible is rendered differently in collapsed mode.
   */
  isFirstValue: PropTypes.bool
}

export const ObjectListItemEventComponent = ObjectListItemEvent

export default withStyles(styles)(ObjectListItemEvent)
