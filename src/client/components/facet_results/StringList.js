import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import HTMLParser from '../../helpers/HTMLParser'

const styles = theme => ({
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
  tooltip: {
    maxWidth: 500
  },
  tooltipContent: {
    padding: theme.spacing(1)
  },
  tooltipList: {
    listStylePosition: 'inside',
    paddingLeft: 0
  }
})

const StringList = props => {
  const createFirstValue = (data, isArray) => {
    let firstValue = isArray ? data[0] : data
    if (props.collapsedMaxWords) {
      const wordCount = firstValue.split(' ').length
      if (wordCount > props.collapsedMaxWords) {
        firstValue = firstValue.trim().split(' ').splice(0, props.collapsedMaxWords).join(' ')
        firstValue = `${firstValue}...`
      }
    } else if (isArray) {
      firstValue = `${firstValue}...`
    }
    return (
      <div className={props.classes.stringContainer}>{firstValue}</div>
    )
  }

  const createBasicList = data => {
    data = data.sort()
    if (props.numberedList) {
      return (
        <ol className={props.classes.numberedList}>
          {data.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      )
    } else {
      return (
        <ul className={props.classes.valueList}>
          {data.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )
    }
  }

  const { renderAsHTML } = props
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
        {!isArray && <div className={props.classes.stringContainer}>{data}</div>}
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
