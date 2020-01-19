import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MainCard from './MainCard'
import bannerImage from '../../img/mmm-banner.jpg'
import mmmLogo from '../../img/mmm-logo-94x90.png'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 150px)',
      overflow: 'auto'
    }
  },
  banner: {
    background: `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(${bannerImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 220,
    [theme.breakpoints.up('xl')]: {
      height: 300
    },
    width: '100%',
    boxShadow: '0 -15px 15px 0px #bdbdbd inset',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerContent: {
    display: 'inline-block',
    color: '#fff'
  },
  firstLetter: {
    [theme.breakpoints.down('xs')]: {
      height: 20
    },
    [theme.breakpoints.between('xs', 'md')]: {
      height: 40
    },
    [theme.breakpoints.between('md', 'xl')]: {
      height: 50,
      marginRight: 2
    },
    [theme.breakpoints.up('xl')]: {
      height: 88,
      marginRight: 4
    }
  },
  bannerSubheading: {
    marginTop: theme.spacing(1.5),
    display: 'flex',
    '& div': {
      flexGrow: 1,
      width: 0
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
}))

const Main = props => {
  const { perspectives } = props
  const classes = useStyles(props)
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('xs'))
  const smScreen = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'))
  const mdScreen = useMediaQuery(theme => theme.breakpoints.between('md', 'lg'))
  const lgScreen = useMediaQuery(theme => theme.breakpoints.between('lg', 'xl'))
  const xlScreen = useMediaQuery(theme => theme.breakpoints.up('xl'))
  let headingVariant = 'h5'
  let subheadingVariant = 'body1'
  let descriptionVariant = 'body1'
  if (smScreen) {
    headingVariant = 'h4'
    subheadingVariant = 'h6'
    descriptionVariant = 'h6'
  }
  if (mdScreen) {
    headingVariant = 'h3'
    subheadingVariant = 'h6'
    descriptionVariant = 'h6'
  }
  if (lgScreen) {
    headingVariant = 'h2'
    subheadingVariant = 'h5'
    descriptionVariant = 'h6'
  }
  if (xlScreen) {
    headingVariant = 'h1'
    subheadingVariant = 'h4'
    descriptionVariant = 'h6'
  }

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
      <div className={classes.banner}>
        <div className={classes.bannerContent}>
          <div className={classes.bannerHeading}>
            <img className={classes.firstLetter} src={mmmLogo} />
            <Typography component='span' variant={headingVariant} align='center'>
              {intl.get('appTitle.long')}
            </Typography>
          </div>
          <div className={classes.bannerSubheading}>
            <div>
              <Typography component='h2' variant={subheadingVariant} align='center'>
                {intl.get('appTitle.subheading')}
              </Typography>
            </div>
          </div>

        </div>

      </div>
      <div className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography variant={descriptionVariant} color='textPrimary' paragraph>
            {intl.getHTML('appDescription')}
          </Typography>
          <Typography variant={descriptionVariant} align='center' color='textPrimary' paragraph>
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
  perspectives: PropTypes.array.isRequired
}

export default Main
