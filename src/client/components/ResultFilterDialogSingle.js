import React from 'react';
import PropTypes from 'prop-types';
//import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
// import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import CheckboxList from './CheckboxList';

const styles = () => ({
  root: {
    display: 'inline',
  },
  dialogContent: {
    margin: 40
  }
});

class ResultFilterDialogSingle extends React.Component {
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
    const { classes, property, resultValues } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleClickOpen}
          id={'filter' + property}
          aria-label="Filter"
        >
          <FilterListIcon />
        </IconButton>
        <Dialog
          className={classes.filterDialog}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Filter {property} values</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Paper className={classes.paper}>
              <CheckboxList
                list={resultValues}
                property={property}
                updateResultsFilter={this.props.updateResultsFilter}
              />
            </Paper>
          </DialogContent>

        </Dialog>
      </div>
    );
  }
}


ResultFilterDialogSingle.propTypes = {
  classes: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  resultValues: PropTypes.array.isRequired,
  updateResultsFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(ResultFilterDialogSingle);
