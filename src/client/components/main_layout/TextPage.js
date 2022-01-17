import React from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper'

const useStyles = makeStyles(theme => ({
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
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.5),
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
}))

/**
 * A component for creating a responsive page with static content.
 */
const TextPage = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Paper className={classes.layout}>
        {props.children}
      </Paper>
    </div>
  )
}

TextPage.propTypes = {
  /**
   * The content of the page.
   */
  children: PropTypes.node
}

export default TextPage
