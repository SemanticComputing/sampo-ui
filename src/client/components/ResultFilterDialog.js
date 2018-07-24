import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CheckboxList from './CheckboxList';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 500,
    width: 300,
    overflowY: 'auto'
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ResultFilterDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    // <Grid item>
    //   <Paper className={classes.paper}>
    //     <CheckboxList list={this.props.resultValues.broaderAreaLabels} />
    //   </Paper>
    // </Grid>
    // <Grid item>
    //   <Paper className={classes.paper}>
    //     <CheckboxList list={this.props.resultValues.sources} />
    //   </Paper>
    // </Grid>

    return (
      <div>
        <Button onClick={this.handleClickOpen}>Result filters</Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Result filters
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent className={classes.root}>
            <Grid container justify='center' spacing={24}>
              <Grid item>
                <Typography variant="title" color="inherit" className={classes.title}>
                  Type
                </Typography>
                <Paper className={classes.paper}>
                  <CheckboxList
                    list={this.props.resultValues.typeLabels}
                    property='typeLabel'
                    updateResultsFilter={this.props.updateResultsFilter}
                  />
                </Paper>
              </Grid>
              <Grid item>
                <Typography variant="title" color="inherit" className={classes.title}>
                  Area
                </Typography>
                <Paper className={classes.paper}>
                  <CheckboxList
                    list={this.props.resultValues.broaderAreaLabels}
                    property='broaderAreaLabel'
                    updateResultsFilter={this.props.updateResultsFilter}
                  />
                </Paper>
              </Grid>
              <Grid item>
                <Typography variant="title" color="inherit" className={classes.title}>
                  Source
                </Typography>
                <Paper className={classes.paper}>
                  <CheckboxList
                    list={this.props.resultValues.sources}
                    property='source'
                    updateResultsFilter={this.props.updateResultsFilter}
                  />
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ResultFilterDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  resultValues: PropTypes.object,
  updateResultsFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(ResultFilterDialog);
