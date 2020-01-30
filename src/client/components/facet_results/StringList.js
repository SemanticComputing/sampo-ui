import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { useHistory } from 'react-router-dom'

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
  const history = useHistory()

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

  const addLinks = htmlString => {
    // Parse HTML with JavaScript DOM Parser
    const parser = new DOMParser()
    const el = parser.parseFromString(htmlString, 'text/html')
    el.querySelectorAll('a').forEach(a => {
      const link = '<span>'
      a.replaceWith(link)
    })
    // el.querySelectorAll('a').forEach(a => {
    //   a.addEventListener('click', (event) => {
    //     event.preventDefault()
    //     const href = a.getAttribute('href')
    //     history.push('/manuscripts/page/100')
    //   })
    // })
    console.log(el)
    return el.innerHTML
  }

  const { renderAsHTML } = props
  const { data } = props
  if (data == null || data === '-') {
    return '-'
  }
  const isArray = Array.isArray(data)
  if (renderAsHTML) {
    // data = addLinks(data)
    console.log(data)
  }
  return (
    <>
      {!props.expanded && createFirstValue(data, isArray)}
      <Collapse in={props.expanded} timeout='auto' unmountOnExit>
        {isArray && createBasicList(data)}
        {!isArray && !renderAsHTML && <div className={props.classes.stringContainer}>{data}</div>}
        {!isArray && renderAsHTML &&
          <div
            className={props.classes.stringContainer}
            dangerouslySetInnerHTML={{ __html: data }}
          />}
      </Collapse>
    </>
  )
}

StringList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  expanded: PropTypes.bool.isRequired,
  collapsedMaxWords: PropTypes.number,
  renderAsHTML: PropTypes.bool
}

export default withStyles(styles)(StringList)
