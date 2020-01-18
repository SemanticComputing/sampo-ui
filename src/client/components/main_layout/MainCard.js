import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import intl from 'react-intl-universal'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  gridItem: {
    textDecoration: 'none',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  perspectiveCard: props => ({
    padding: theme.spacing(1.5),
    color: '#fff',
    background: `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(${props.perspective.frontPageImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&:hover': {
      background: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url(${props.perspective.frontPageImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      width: 351 - theme.spacing(3),
      height: 180
    },
    [theme.breakpoints.between(600, 780)]: {
      height: 180
    },
    [theme.breakpoints.between(780, 960)]: {
      height: 238
    },
    [theme.breakpoints.between('md', 'lg')]: {
      height: 100
    },
    [theme.breakpoints.up('xl')]: {
      height: 180
    }
  })
}))

const MainCard = props => {
  const classes = useStyles(props)
  const { perspective, cardHeadingVariant } = props
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('xs'))
  // const smScreen = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'))
  return (
    <Grid
      className={classes.gridItem}
      key={perspective.id}
      item xs={12} sm={6} md lg xl={4}
      component={Link}
      to={`/${perspective.id}/faceted-search`}
      container={xsScreen}
    >
      <Paper className={classes.perspectiveCard}>
        <Typography gutterBottom variant={cardHeadingVariant} component='h2'>
          {intl.get(`perspectives.${perspective.id}.label`)}
        </Typography>
        <Typography component='p'>
          {intl.get(`perspectives.${perspective.id}.shortDescription`)}
        </Typography>
      </Paper>
    </Grid>
  )
}

MainCard.propTypes = {
  perspective: PropTypes.object.isRequired,
  cardHeadingVariant: PropTypes.string.isRequired
}

export default MainCard
