import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Collapse from '@mui/material/Collapse'
import { ISOStringToDate } from './Dates'
import { orderBy, has } from 'lodash'
import ObjectListItem from './ObjectListItem'
import ObjectListItemSources from './ObjectListItemSources'
import ObjectListItemEvent from './ObjectListItemEvent'
import classNames from 'classnames'

const styles = () => ({
  resultTableList: props => ({
    maxHeight: props.tableData && props.tableData.paginatedResultsRowContentMaxHeight
      ? props.tableData.paginatedResultsRowContentMaxHeight
      : 200,
    overflow: 'auto'
  }),
  valueList: props => ({
    paddingLeft: 20
  }),
  dateContainer: {
    width: 180,
    display: 'inline-block'
  },
  threeDots: {
    cursor: 'pointer'
  }
})

const ObjectListCollapsible = props => {
  const {
    sortValues, sortBy, sortByConvertDataTypeTo, makeLink, externalLink, linkAsButton, columnId, showSource,
    sourceExternalLink, numberedList, collapsedMaxWords, classes, shortenLabel
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
      if (sortByConvertDataTypeTo && sortByConvertDataTypeTo === 'integer') {
        data.forEach(item => {
          item[sortBy] = parseInt(item[sortBy])
        })
      }
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
          {addThreeDots &&
            <span className={classes.threeDots} onClick={() => props.onExpandClick(props.rowId)}> ...</span>}
        </>
      )
    } else {
      return (
        <>
          <ObjectListItem
            data={itemData}
            shortenLabel={shortenLabel}
            makeLink={makeLink}
            externalLink={externalLink}
            linkAsButton={linkAsButton}
            isFirstValue={isFirstValue}
            collapsedMaxWords={collapsedMaxWords}
          />
          {addThreeDots &&
            <span className={classes.threeDots} onClick={() => props.onExpandClick(props.rowId)}> ...</span>}
          {showSource && itemData.source &&
            <ObjectListItemSources
              data={itemData.source}
              shortenLabel={shortenLabel}
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
    <ul className={classNames(classes.resultTableList, classes.valueList)}>
      {renderListItems(data)}
    </ul>

  const renderNumberedList = data =>
    <ol className={classes.resultTableList}>
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
    return renderItem({ addThreeDots: shortenLabel, itemData: data })
  }
}

ObjectListCollapsible.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  makeLink: PropTypes.bool.isRequired,
  externalLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  numberedList: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  columnId: PropTypes.string.isRequired,
  linkAsButton: PropTypes.bool,
  showSource: PropTypes.bool,
  shortenLabel: PropTypes.bool.isRequired
}

export default withStyles(styles)(ObjectListCollapsible)
