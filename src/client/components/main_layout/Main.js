import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
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
  },
  lowerRow: {
    marginTop: theme.spacing(1)
  },
  licenceTextContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center'
  }
})

const Main = props => {
  const { classes, perspectives } = props
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('xs'))
  const smScreen = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'))
  const xlScreen = useMediaQuery(theme => theme.breakpoints.up('xl'))

  const gridForLargeScreen = () => {
    const upperRowItems = []
    const lowerRowItems = []
    for (let i = 0; i < 3; i++) {
      const perspective = perspectives[i]
      upperRowItems.push(
        <MainCard
          key={perspective.id}
          perspective={perspective}
          cardHeadingVariant='h4'
        />)
    }
    for (let i = 3; i < 5; i++) {
      const perspective = perspectives[i]
      lowerRowItems.push(
        <MainCard
          key={perspective.id}
          perspective={perspective}
          cardHeadingVariant='h4'
        />)
    }
    return (
      <>
        <Grid container spacing={3}>
          {upperRowItems}
        </Grid>
        <Grid className={classes.lowerRow} container justify='center' spacing={3}>
          {lowerRowItems}
        </Grid>
      </>
    )
  }

  const basicGrid = () =>
    <>
      <Grid container spacing={smScreen ? 2 : 1} justify={xsScreen || smScreen ? 'center' : 'flex-start'}>
        {props.perspectives.map(perspective =>
          <MainCard
            key={perspective.id}
            perspective={perspective}
            cardHeadingVariant='h5'
          />)}
      </Grid>
    </>

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
        {xlScreen ? gridForLargeScreen() : basicGrid()}
        <div className={classes.licenceTextContainer}>
          <Typography className={classes.licenceText}>{intl.getHTML('mainPageImageLicence')}</Typography>
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  perspectives: PropTypes.array.isRequired
}

export default withStyles(styles)(Main)
