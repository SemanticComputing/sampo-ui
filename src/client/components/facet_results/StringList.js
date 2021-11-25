import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import HTMLParser from '../../helpers/HTMLParser'
import classNames from 'classnames'

const styles = theme => ({
  resultTableList: props => ({
    maxHeight: props.tableData && props.tableData.paginatedResultsRowContentMaxHeight
      ? props.tableData.paginatedResultsRowContentMaxHeight
      : 200,
    overflow: 'auto'
  }),
  valueList: props => ({
    paddingLeft: 20
  }),
  tooltip: {
    maxWidth: 500
  },
  tooltipContent: {
    padding: theme.spacing(1)
  },
  tooltipList: {
    listStylePosition: 'inside',
    paddingLeft: 0
  },
  threeDots: {
    cursor: 'pointer'
  }
})

const StringList = props => {
  const createFirstValue = (data, isArray) => {
    let firstValue = isArray ? data[0] : data
    let addThreeDots = false
    if (props.collapsedMaxWords) {
      const wordCount = firstValue.split(' ').length
      if (wordCount > props.collapsedMaxWords) {
        firstValue = firstValue.trim().split(' ').splice(0, props.collapsedMaxWords).join(' ')
        addThreeDots = true
        // firstValue = `${firstValue}...`
      }
    } else if (isArray) {
      addThreeDots = true
      // firstValue = `${firstValue}...`
    }
    return (
      <>
        <div>{firstValue}</div>
        {addThreeDots &&
          <span className={props.classes.threeDots} onClick={() => props.onExpandClick(props.rowId)}> ...</span>}
      </>
    )
  }

  const createBasicList = data => {
    data = data.sort()
    if (props.numberedList) {
      return (
        <ol className={classes.resultTableList}>
          {data.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      )
    } else {
      return (
        <ul className={classNames(classes.resultTableList, classes.valueList)}>
          {data.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )
    }
  }

  const { renderAsHTML, classes } = props
  let { data } = props
  if (data == null || data === '-') {
    return '-'
  }
  const isArray = Array.isArray(data)
  if (renderAsHTML) {
    const parser = new HTMLParser(props)
    data = parser.parseHTML(data)
  }
  return (
    <>
      {!props.expanded && createFirstValue(data, isArray)}
      <Collapse in={props.expanded} timeout='auto' unmountOnExit>
        {isArray && createBasicList(data)}
        {!isArray && <div>{data}</div>}
      </Collapse>
    </>
  )
}

StringList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  expanded: PropTypes.bool.isRequired,
  collapsedMaxWords: PropTypes.number,
  renderAsHTML: PropTypes.bool,
  numberedList: PropTypes.bool
}

export default withStyles(styles)(StringList)
