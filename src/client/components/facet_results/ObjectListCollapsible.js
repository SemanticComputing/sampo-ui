import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { ISOStringToDate } from './Dates'
import { orderBy, has } from 'lodash'
import ObjectListItem from './ObjectListItem'
import ObjectListItemSources from './ObjectListItemSources'
import ObjectListItemEvent from './ObjectListItemEvent'

const styles = () => ({
  valueList: {
    paddingLeft: 20,
    maxHeight: 200,
    overflow: 'auto'
  },
  valueListNoBullets: {
    listStyle: 'none',
    paddingLeft: 0
  },
  numberedList: {
    maxHeight: 200,
    overflow: 'auto'
  },
  dateContainer: {
    width: 180,
    display: 'inline-block'
  }
})

const ObjectList = props => {
  const {
    sortValues, sortBy, makeLink, externalLink, linkAsButton, columnId, showSource,
    sourceExternalLink, numberedList, collapsedMaxWords
  } = props
  let { data } = props

  const sortList = data => {
    if (has(props, 'columnId') && props.columnId.endsWith('Timespan')) {
      data = data.sort((a, b) => {
        a = has(a, 'start') ? ISOStringToDate(a.start) : ISOStringToDate(a.end)
        b = has(b, 'start') ? ISOStringToDate(b.start) : ISOStringToDate(b.end)
        // arrange from the most recent to the oldest
        return a > b ? 1 : a < b ? -1 : 0
      })
    } else if (props.columnId === 'event') {
      data = orderBy(data, 'date')
    } else if (props.sortBy) {
      data = orderBy(data, sortBy)
    } else {
      data = orderBy(data, 'prefLabel')
    }
    return data
  }

  const renderItem = ({ addThreeDots, itemData, isFirstValue = false }) => {
    if (columnId === 'event') {
      return (
        <>
          <ObjectListItemEvent
            data={itemData}
            isFirstValue={isFirstValue}
          />
          {addThreeDots && <span> ...</span>}
        </>
      )
    } else {
      return (
        <>
          <ObjectListItem
            data={itemData}
            makeLink={makeLink}
            externalLink={externalLink}
            linkAsButton={linkAsButton}
            isFirstValue={isFirstValue}
            collapsedMaxWords={collapsedMaxWords}
          />
          {addThreeDots && <span> ...</span>}
          {showSource && itemData.source &&
            <ObjectListItemSources
              data={itemData.source}
              externalLink={sourceExternalLink}
            />}
        </>
      )
    }
  }

  const renderListItems = data =>
    <>
      {data.map(item =>
        <li key={item.id}>
          {renderItem({ collapsed: false, itemData: item })}
        </li>
      )}
    </>

  const renderBulletedList = data =>
    <ul className={props.classes.valueList}>
      {renderListItems(data)}
    </ul>

  const renderNumberedList = data =>
    <ol className={props.classes.numberedList}>
      {renderListItems(data)}
    </ol>

  if (data == null || data === '-') {
    return '-'
  } else if (Array.isArray(data)) {
    data = sortValues ? sortList(data) : data
    return (
      <>
        {!props.expanded && renderItem({ addThreeDots: true, itemData: data[0], isFirstValue: true })}
        <Collapse in={props.expanded} timeout='auto' unmountOnExit>
          {numberedList ? renderNumberedList(data) : renderBulletedList(data)}
        </Collapse>
      </>
    )
  } else {
    return renderItem({ addThreeDots: data.shortenLabel, itemData: data })
  }
}

ObjectList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  makeLink: PropTypes.bool.isRequired,
  externalLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  columnId: PropTypes.string.isRequired,
  linkAsButton: PropTypes.bool,
  showSource: PropTypes.bool
}

export default withStyles(styles)(ObjectList)
