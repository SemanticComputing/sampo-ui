import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'

const styles = () => ({
  valueList: {
    paddingLeft: 20,
    maxHeight: 200,
    overflow: 'auto'
  },
  valueListNoBullets: {
    listStyle: 'none',
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
    return (
      <ul className={props.classes.valueList}>
        {data.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    )
  }

  const { data } = props
  if (data == null || data === '-') {
    return '-'
  }
  const isArray = Array.isArray(data)
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
  collapsedMaxWords: PropTypes.number
}

export default withStyles(styles)(StringList)
