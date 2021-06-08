import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import MainCard from './MainCard'

const useStyles = makeStyles(theme => ({
  root: props => ({
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      overflow: 'auto',
      height: `calc(100% - ${props.layoutConfig.topBar.reducedHeight + props.layoutConfig.footer.height + theme.spacing(3.5)}px)`
    },
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      overflow: 'auto',
      height: `calc(100% - ${props.layoutConfig.topBar.defaultHeight + props.layoutConfig.footer.height + theme.spacing(3.5)}px)`
    },
    marginBottom: theme.spacing(5)
  }),
  banner: props => ({
    background: props.layoutConfig.mainPage.bannerBackround,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: props.layoutConfig.mainPage.bannerReducedHeight,
    [theme.breakpoints.up('xl')]: {
      height: props.layoutConfig.mainPage.bannerDefaultHeight
    },
    boxShadow: '0 -15px 15px 0px #bdbdbd inset',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  bannerContent: {
    display: 'inline-block',
    color: '#fff'
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.up(800 + theme.spacing(6))]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  heroContent: {
    // paddingTop: theme.spacing(3),
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

/**
 * A component for generating a landing page for a semantic portal.
 */
const Main = props => {
  const { perspectives, screenSize } = props
  const classes = useStyles(props)
  let headingVariant = 'h5'
  let subheadingVariant = 'body1'
  let descriptionVariant = 'body1'
  switch (screenSize) {
    case 'xs':
      headingVariant = 'h5'
      subheadingVariant = 'body1'
      descriptionVariant = 'body1'
      break
    case 'sm':
      headingVariant = 'h4'
      subheadingVariant = 'h6'
      descriptionVariant = 'h6'
      break
    case 'md':
      headingVariant = 'h3'
      subheadingVariant = 'h6'
      descriptionVariant = 'h6'
      break
    case 'lg':
      headingVariant = 'h2'
      subheadingVariant = 'h5'
      descriptionVariant = 'h6'
      break
    case 'xl':
      headingVariant = 'h1'
      subheadingVariant = 'h4'
      descriptionVariant = 'h6'
      break
  }

  return (
    <div className={classes.root}>
      <div className={classes.banner}>
        <div className={classes.bannerContent}>
          <div className={classes.bannerHeading}>
            <Typography component='span' variant={headingVariant} align='center'>
              {intl.getHTML('appTitle.long')}
            </Typography>
          </div>
          <div className={classes.bannerSubheading}>
            <div>
              <Typography component='h2' variant={subheadingVariant} align='center'>
                {intl.getHTML('appTitle.subheading')}
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
        <Grid
          container spacing={screenSize === 'sm' ? 2 : 1}
          justify={screenSize === 'xs' || screenSize === 'sm' ? 'center' : 'flex-start'}
        >
          {perspectives.map(perspective => {
            if (!perspective.isHidden) {
              return (
                <MainCard
                  key={perspective.id}
                  perspective={perspective}
                  cardHeadingVariant='h5'
                  rootUrl={props.rootUrl}
                />
              )
            }
          })}
        </Grid>
        <div className={classes.licenceTextContainer}>
          <Typography className={classes.licenceText}>{intl.getHTML('mainPageImageLicence')}</Typography>
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {
  /**
   * An array of objects used for configuration. Each object represents a single perspective.
   */
  perspectives: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default Main
