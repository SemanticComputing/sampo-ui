import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import MainCardMMM from './MainCardMMM'

const useStyles = makeStyles(theme => ({
  lowerRow: {
    marginTop: theme.spacing(1)
  }
}))

const MainGridLgMMM = props => {
  const { perspectives } = props
  const classes = useStyles()
  const upperRowItems = []
  const lowerRowItems = []
  for (let i = 0; i < 3; i++) {
    const perspective = perspectives[i]
    upperRowItems.push(
      <MainCardMMM
        key={perspective.id}
        perspective={perspective}
        cardHeadingVariant='h4'
      />)
  }
  for (let i = 3; i < 5; i++) {
    const perspective = perspectives[i]
    lowerRowItems.push(
      <MainCardMMM
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

MainGridLgMMM.propTypes = {
  perspectives: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired
}

export default MainGridLgMMM
