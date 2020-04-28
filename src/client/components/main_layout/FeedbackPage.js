import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    padding: theme.spacing(1),
    width: '100%',
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
      width: 800
    }
  },
  // https://benmarshall.me/responsive-iframes/
  iframeContainer: {
    overflow: 'hidden',
    paddingTop: '93%', // paddingTop controls the aspect ratio
    [theme.breakpoints.down('xs')]: {
      paddingTop: '185%'
    },
    [theme.breakpoints.between('sm', 700)]: {
      paddingTop: '130%'
    },
    [theme.breakpoints.between(701, 800)]: {
      paddingTop: '110%'
    },
    // [theme.breakpoints.between('md', 'lg')]: {
    //   paddingTop: '110%'
    // },
    position: 'relative'
  },
  iframe: {
    border: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 500
  }
})

class FeedbackPage extends React.Component {
  state = {
    loading: true
  };

  handleHideSpinner = () => {
    this.setState({ loading: false })
  };

  render () {
    const { classes } = this.props
    const { loading } = this.state
    return (
      <div className={classes.root}>
        <Paper className={classes.content}>
          {loading ? (
            <div className={classes.spinnerContainer}>
              <CircularProgress style={{ color: purple[500] }} thickness={5} />
            </div>
          ) : null}
          <div className={classes.iframeContainer}>
            <iframe
              className={classes.iframe}
              src='https://link.webropolsurveys.com/S/3BA01B62823131EF'
              onLoad={this.handleHideSpinner}
            />
          </div>
        </Paper>
      </div>
    )
  }
}

FeedbackPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FeedbackPage)
