import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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
      width: 800,
    },
  },
});

const AboutPage = props => {
  const { classes } = props;
  return(
    <div className={classes.root}>
      <Paper className={classes.content}>

      </Paper>
    </div>
  );
};


AboutPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AboutPage);
