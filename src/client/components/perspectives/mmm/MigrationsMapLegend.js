import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  legend: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1)
  },
  red: {
    color: 'rgba(255,0,0,255)'
  },
  blue: {
    color: 'rgba(0,0,255,255)'
  }
})

const MigrationsMapLegend = props => {
  const { classes } = props
  return (
    <Card className={classes.legend}>
      <CardContent>
        <Typography variant='h6' gutterBottom>Arc colouring:</Typography>
        <Typography className={classes.blue} variant='body2' gutterBottom>Manuscript production place</Typography>
        <br />
        <Typography variant='body2' gutterBottom>
          <span className={classes.red}>
                Last known location
          </span>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(MigrationsMapLegend)
