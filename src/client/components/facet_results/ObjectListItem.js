import React from 'react'
import PropTypes from 'prop-types'
import ObjectListItemLink from './ObjectListItemLink'

const ObjectListItem = props => {
  const { data, makeLink, externalLink, linkAsButton, isFirstValue, collapsedMaxWords } = props
  let label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel
  if ((isFirstValue || data.shortenLabel) && collapsedMaxWords) {
    const wordCount = label.split(' ').length
    if (wordCount > collapsedMaxWords) {
      label = label.trim().split(' ').splice(0, props.collapsedMaxWords).join(' ')
    }
  }
  return (
    <>
      {!makeLink && label}
      {makeLink &&
        <ObjectListItemLink
          data={data}
          label={label}
          externalLink={externalLink}
          linkAsButton={linkAsButton}
        />}
    </>
  )
}

ObjectListItem.propTypes = {
  data: PropTypes.object.isRequired,
  makeLink: PropTypes.bool.isRequired,
  externalLink: PropTypes.bool.isRequired,
  linkAsButton: PropTypes.bool
}

export default ObjectListItem
