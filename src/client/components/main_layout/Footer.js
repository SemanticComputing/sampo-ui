import React from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import oxfordLogo from '../../img/logos/partners/ox_brand6_pos_rect.gif';
import oxfordLogo2 from '../../img/logos/partners/Long-Logo-RGB.jpg';
import pennLogo from '../../img/logos/partners/PL SIMS Logo_small.png';
import cnrsLogo from '../../img/logos/partners/logo_cnrs_irht2.jpg';
import aaltoLogo from '../../img/logos/partners/Aalto_SCI_EN_13_BLACK_2_cropped.png';
import secoLogo from '../../img/logos/partners/13_9_04_logo_cropped_small.png';

//const logoPadding = 50;
const logoHeight = 50;

const styles = theme => ({
  root: {
    position: 'absolute',

    boxShadow: '0 -10px 10px -10px #333',
    //borderTop: '4px solid' + theme.palette.primary.main,
    //display: 'flex',
    //alignItems: 'center',
    //justifyContent: 'center',
    bottom: 0,
    width: '100%',
    height: 64,
    //background: theme.palette.primary.main,
    borderRadius: 0,
  },
  layout: {
    width: 'auto',
    height: '100%',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(1500 + theme.spacing.unit * 3 * 2)]: {
      width: 1500,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  oxfordLogo: {
    //paddingLeft: 24,
    height: logoHeight
  },
  oxfordLogo2: {
    //paddingLeft: logoPadding,
    height: logoHeight
  },
  pennLogo: {
    //paddingLeft: logoPadding,
    height: logoHeight
  },
  cnrsLogo: {
    //paddingLeft: logoPadding,
    height: logoHeight
  },
  aaltoLogo: {
    //paddingLeft: logoPadding,
    height: logoHeight - 8
  },
  secoLogo: {
    //paddingLeft: logoPadding,
    height: logoHeight
  },
});

const Footer = props => {
  const { classes } = props;
  return (

    <Paper className={classes.root}>
      <Grid container spacing={0} className={classes.layout}>
        <Grid item xs className={classes.logoContainer}>
          <img className={classes.oxfordLogo} src={oxfordLogo} alt='logo' />
        </Grid>
        <Grid item xs className={classes.logoContainer}>
          <img className={classes.oxfordLogo2} src={oxfordLogo2} alt='logo' />
        </Grid>
        <Grid item xs className={classes.logoContainer}>
          <img className={classes.pennLogo} src={pennLogo} alt='logo' />
        </Grid>
        <Grid item xs className={classes.logoContainer}>
          <img className={classes.cnrsLogo} src={cnrsLogo} alt='logo' />
        </Grid>
        <Grid item xs className={classes.logoContainer}>
          <img className={classes.aaltoLogo} src={aaltoLogo} alt='logo' />
        </Grid>
        <Grid item xs className={classes.logoContainer}>
          <img className={classes.secoLogo} src={secoLogo} alt='logo' />
        </Grid>
      </Grid>
    </Paper>
  );
};

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
