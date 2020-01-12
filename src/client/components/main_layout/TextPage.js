import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  layout: {
    width: 'auto',
    padding: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      marginLeft: 0,
      marginRight: 0
    },
    [theme.breakpoints.up(1100 + theme.spacing(6))]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    overflow: 'auto'
  }
})

const TextPage = props => {
  const { classes } = props
  return (
    <div className={classes.root}>
      <Paper className={classes.layout}>
        {props.children}
      </Paper>
    </div>
  )
}

TextPage.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default withStyles(styles)(TextPage)
