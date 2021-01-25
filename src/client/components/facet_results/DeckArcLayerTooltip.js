import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const MigrationsMapTooltip = props => {
  const { data, fromText, toText, countText, showMoreText } = props
  const { from, to, instanceCount } = data.object
  const rootStyle = {
    padding: 12,
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'none',
    left: data.x,
    top: data.y
  }

  return (
    <Paper style={rootStyle}>
      <Typography>{fromText} &nbsp;
        {Array.isArray(from.prefLabel) ? from.prefLabel[0] : from.prefLabel}
      </Typography>
      <Typography>{toText} &nbsp;
        {Array.isArray(to.prefLabel) ? to.prefLabel[0] : to.prefLabel}
      </Typography>
      <Typography>{countText} &nbsp;
        {instanceCount}
      </Typography>
      <br />
      <Typography>{showMoreText}</Typography>
    </Paper>
  )
}

MigrationsMapTooltip.propTypes = {
  data: PropTypes.object.isRequired,
  fromText: PropTypes.string.isRequired,
  toText: PropTypes.string.isRequired,
  showMoreText: PropTypes.string.isRequired
}

export default MigrationsMapTooltip
