import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import intl from 'react-intl-universal'
import bgImage from '../../../../img/main_page/bg2.jpg'
import Footer from '../Footer'

const styles = theme => ({
  root: {
    height: '100%',
    // width: '100%',
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: theme.spacing(3),
    // paddingLeft: theme.spacing(3),
    // paddingRight: theme.spacing(3),
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1)
    }
  },
  frontPageHeading: {
    [theme.breakpoints.down('md')]: {
      fontSize: '1.2rem'
    }
  },
  frontPageText: {
    [theme.breakpoints.down('md')]: {
      fontSize: '1.0rem'
    }
  }

})

const ClientFSMain = props => {
  const { classes } = props
  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.content}>
          <div className={classes.textContainer}>
            <Typography className={classes.frontPageHeading} component='h1' variant='h3' align='center' color='textPrimary' gutterBottom>
              {intl.getHTML('appTitle.long')}
            </Typography>
            <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
              {intl.get('appDescription1')}
            </Typography>
            <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
              {intl.get('appDescription2')}
            </Typography>
            <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
              {intl.get('appDescription3')}
            </Typography>
            <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
              {intl.get('appDescription4')}
            </Typography>
          </div>
        </div>
      </Paper>
      <Footer />
    </>
  )
}

ClientFSMain.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(ClientFSMain)
