import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import intl from 'react-intl-universal'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none'
  },
  perspectiveCard: props => ({
    height: 100,
    padding: theme.spacing(1.5),
    color: '#fff',
    background: `linear-gradient( rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45) ), url(${props.perspective.frontPageImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('md')]: {
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    [theme.breakpoints.up('lg')]: {
      height: 180,
      backgroundSize: 'cover'
    },
    '&:hover': {
      background: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url(${props.perspective.frontPageImage})`
    }
  })
}))

const MainCard = props => {
  const classes = useStyles(props)
  const { perspective } = props
  return (
    <Grid
      className={classes.link}
      key={perspective.id}
      item xs={12} sm={4} md lg={4}
      component={Link}
      to={`/${perspective.id}/faceted-search`}
    >
      <Paper className={classes.perspectiveCard}>
        <Typography gutterBottom variant='h5' component='h2'>
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
  perspective: PropTypes.object.isRequired
}

export default MainCard
