import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import MainCard from './MainCard'

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 150px)',
      overflow: 'auto'
    }
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(6))]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  heroContent: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  licenceText: {
    marginTop: theme.spacing(0.5),
    fontSize: '0.7em'
  }
})

const Main = props => {
  const { classes } = props
  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography component='h1' variant='h3' align='center' color='textPrimary' gutterBottom>
            {intl.get('appTitle.long')}
          </Typography>
          <Typography variant='h6' align='center' color='textPrimary' paragraph>
            {intl.get('appDescription')}
          </Typography>
          <Typography variant='h6' align='center' color='textPrimary' paragraph>
            {intl.get('selectPerspective')}
          </Typography>
        </div>
        <Grid container spacing={1}>
          {props.perspectives.map(perspective => <MainCard key={perspective.id} perspective={perspective} />)}
        </Grid>
        <Typography className={classes.licenceText}>{intl.getHTML('mainPageImageLicence')}</Typography>
      </div>
    </div>
  )
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  perspectives: PropTypes.array.isRequired
}

export default withStyles(styles)(Main)
