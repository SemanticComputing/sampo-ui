import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
// import ManuscriptList from './ManuscriptList'

const MigrationsMapTooltip = props => {
  const { data } = props
  const { from, to /* manuscript */ } = data.object
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
      <Typography>Production place: &nbsp;
        {Array.isArray(from.prefLabel) ? from.prefLabel[0] : from.prefLabel}
      </Typography>
      <Typography>Last known location: &nbsp;
        {Array.isArray(to.prefLabel) ? to.prefLabel[0] : to.prefLabel}
      </Typography>
      <br />
      <Typography>Click to show more information.</Typography>
      {/* <ManuscriptList manuscripts={manuscript} /> */}
    </Paper>
  )
}

MigrationsMapTooltip.propTypes = {
  data: PropTypes.object.isRequired
}

export default MigrationsMapTooltip
