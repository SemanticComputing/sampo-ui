import React from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import oxfordLogo from '../img/logos/oxford-logo-white.png';
import pennLogo from '../img/logos/penn-logo-white.png';
import cnrsLogo from '../img/logos/cnrs-logo-white-small.png';
import aaltoLogo from '../img/logos/aalto-logo-white-no-background-small.png';

const logoPadding = 50;
const logoHeight = 52;

const styles = theme => ({
  root: {
    position: 'absolute',
    borderTop: '4px solid' + theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    width: '100%',
    height: 64,
    background: theme.palette.primary.main,
    borderRadius: 0,
  },
  oxfordLogo: {
    //paddingLeft: 24,
    height: logoHeight
  },
  pennLogo: {
    paddingLeft: logoPadding,
    height: logoHeight - 8
  },
  cnrsLogo: {
    paddingLeft: logoPadding,
    height: logoHeight
  },
  aaltoLogo: {
    paddingLeft: logoPadding,
    height: logoHeight - 10
  },
});

const Footer = props => {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <img className={classes.oxfordLogo} src={oxfordLogo} alt='logo' />
      <img className={classes.pennLogo} src={pennLogo} alt='logo' />
      <img className={classes.cnrsLogo} src={cnrsLogo} alt='logo' />
      <img className={classes.aaltoLogo} src={aaltoLogo} alt='logo' />
    </Paper>
  );
};

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
