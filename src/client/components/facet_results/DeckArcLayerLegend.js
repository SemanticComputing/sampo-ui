import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

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

const DeckArcLayerLegend = props => {
  const { classes, title, fromText, toText } = props
  return (
    <Card className={classes.legend}>
      <CardContent>
        <Typography variant='h6' gutterBottom>{title}</Typography>
        <Typography className={classes.blue} variant='body2' gutterBottom>
          {fromText}
        </Typography>
        <br />
        <Typography className={classes.red} variant='body2' gutterBottom>
          {toText}
        </Typography>
      </CardContent>
    </Card>
  )
}

DeckArcLayerLegend.propTypes = {
  title: PropTypes.string.isRequired,
  fromText: PropTypes.string.isRequired,
  toText: PropTypes.string.isRequired
}

export default withStyles(styles)(DeckArcLayerLegend)
