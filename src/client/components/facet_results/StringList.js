import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HTMLParser from '../../helpers/HTMLParser'
import classNames from 'classnames'
import clsx from 'clsx'

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
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

const StringList = props => {
  const parser = new HTMLParser(props)

  const createFirstValue = data => {
    let firstValue = Array.isArray(data) ? data[0] : data
    let addThreeDots = false
    if (props.collapsedMaxWords) {
      const wordCount = firstValue.split(' ').length
      if (wordCount > props.collapsedMaxWords) {
        firstValue = firstValue.trim().split(' ').splice(0, props.collapsedMaxWords).join(' ')
        addThreeDots = true
      }
    } else if (isArray) {
      addThreeDots = true
    }
    if (props.renderAsHTML) {
      firstValue = parser.parseHTML(firstValue)
    }
    return (
      <>
        <span>{firstValue}</span>
        {addThreeDots &&
          <span className={props.classes.threeDots} onClick={() => props.onExpandClick(props.rowId)}>...</span>}
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

  const { renderAsHTML, classes, expanded, rowId, onExpandClick, showExtraCollapseButton = false } = props
  let { data } = props
  if (data == null || data === '-') {
    return '-'
  }
  const isArray = Array.isArray(data)
  let firstValue
  if (!expanded) {
    firstValue = createFirstValue(data)
  }
  if (renderAsHTML) {
    data = parser.parseHTML(data)
  }
  return (
    <>
      {!expanded && firstValue}
      <Collapse in={props.expanded} timeout='auto' unmountOnExit>
        {isArray && createBasicList(data)}
        {!isArray && <>{data}</>}
      </Collapse>
      {expanded && showExtraCollapseButton &&
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={() => onExpandClick(rowId)}
          aria-expanded={expanded}
          aria-label='Show more'
          size='large'
        >
          <ExpandMoreIcon />
        </IconButton>}
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
