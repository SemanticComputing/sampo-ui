import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'tss-react/mui'
import Typography from '@mui/material/Typography'

const styles = () => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ResultInfo = props => {
  const { classes } = props
  return (
    <div className={classes.root}>
      <Typography variant='h6'>{props.message}</Typography>
    </div>
  )
}

ResultInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string
}

export default withStyles(ResultInfo, styles)
