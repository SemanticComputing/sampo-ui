import React from 'react'
import Paper from '@mui/material/Paper'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import makeStyles from '@mui/styles/makeStyles'
import { getSpacing } from '../../../helpers/helpers'
import aaltoLogo from '../../../img/logos/Aalto_SCI_EN_13_BLACK_2_cropped.png'
import hyLogo from '../../../img/logos/university-of-helsinki-logo-transparent-black.png'
import heldigLogo from '../../../img/logos/heldig-logo-transparent-black.png'

const useStyles = makeStyles(theme => ({
  gridContainer: {
    height: '100%',
    marginTop: 0,
    marginBottom: 0
  },
  gridItem: props => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '6px !important',
    paddingBottom: '6px !important',
    [theme.breakpoints.between('sm', props.layoutConfig.reducedHeightBreakpoint)]: {
      paddingTop: '0px !important',
      paddingBottom: '0px !important'
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: '12px !important',
      paddingBottom: '12px !important'
    }
  }),
  link: {
    display: 'flex',
    alignItems: 'center'
  },
  aaltoLogo: props => ({
    width: 143,
    height: 29,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      width: 167,
      height: 34
    }
  }),
  hyLogo: props => ({
    width: 157,
    height: 42,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      width: 168,
      height: 45
    }
  }),
  heldigLogo: props => ({
    width: 118,
    height: 30,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      width: 130,
      height: 33
    }
  })
}))

/**
 * A component for creating a footer. The logos are imported inside this component.
 */
const Footer = props => {
  const classes = useStyles(props)
  return (
    <Paper
      sx={theme => ({
        boxShadow: '0 -20px 20px -20px #333',
        borderRadius: 0,
        height: {
          hundredPercentHeight: props.layoutConfig.footer.reducedHeight,
          reducedHeight: props.layoutConfig.footer.defaultHeight
        }
      })}
    >
      <Grid
        className={classes.gridContainer}
        container spacing={3}
        sx={theme => ({
          height: '100%',
          marginTop: 0,
          marginBottom: 0,
          [theme.breakpoints.up(1500 + getSpacing(theme, 6))]: {
            width: 1500,
            marginLeft: 'auto',
            marginRight: 'auto'
          }
        })}
      >
        <Grid item xs className={classes.gridItem}>
          <a className={classes.link} href='https://www.aalto.fi/en/school-of-science' target='_blank' rel='noopener noreferrer'>
            <img className={classes.aaltoLogo} src={aaltoLogo} alt='Aalto University logo' />
          </a>
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <a className={classes.link} href='https://www.helsinki.fi/en' target='_blank' rel='noopener noreferrer'>
            <img className={classes.hyLogo} src={hyLogo} alt='University of Helsinki logo' />
          </a>
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <a className={classes.link} href='https://www.helsinki.fi/en/helsinki-centre-for-digital-humanities' target='_blank' rel='noopener noreferrer'>
            <img className={classes.heldigLogo} src={heldigLogo} alt='Helsinki Centre for Digital Humanities logo' />
          </a>
        </Grid>
      </Grid>
    </Paper>
  )
}

Footer.propTypes = {
  layoutConfig: PropTypes.object.isRequired
}

export default Footer
