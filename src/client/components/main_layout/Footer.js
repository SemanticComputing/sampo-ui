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
import tapLogo from '../../img/logos/funders/cropped-logo_tap_0_.png';
import didLogo from '../../img/logos/funders/did_logo.png';
import imlsLogo from '../../img/logos/funders/imls_logo_2c_cropped.jpg';
import anrLogo from '../../img/logos/funders/Agence_Nationale_de_la_Recherche.png';
import akaLogo from '../../img/logos/funders/aka_en_vaaka_rgb.jpg';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    boxShadow: '0 -20px 20px -20px #333',
    width: '100%',
    borderRadius: 0,
  },
  layout: {
    width: 'auto',
    height: 150,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
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
  logo: {
    height: 50,
    [ theme.breakpoints.down(1090) ]: {
      height: 40
    }
  },
  aaltoLogo: {
    height: 42,
    [ theme.breakpoints.down(1090) ]: {
      height: 35
    }
  },
});

const Footer = props => {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <Grid container className={classes.layout}>
        <Grid container spacing={24} item xs={12}>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={oxfordLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={oxfordLogo2} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={pennLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={cnrsLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.aaltoLogo} src={aaltoLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={secoLogo} alt='logo' />
          </Grid>
        </Grid>
        <Grid container spacing={24} item xs={12}>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={tapLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={didLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={imlsLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={anrLogo} alt='logo' />
          </Grid>
          <Grid item xs className={classes.logoContainer}>
            <img className={classes.logo} src={akaLogo} alt='logo' />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
