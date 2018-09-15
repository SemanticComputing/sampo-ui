import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import CheckboxList from './CheckboxList';

const styles = () => ({
  root: {
    display: 'inline'
  },
  iconButton: {
    width: 25,
    height: 25
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
    const { classes, propertyLabel, property, resultValues } = this.props;

    return (
      <div className={classes.root}>
        <IconButton className={classes.iconButton}
          onClick={this.handleClickOpen}
          id={'filter' + property}
          aria-label="Filter"
        >
          <FilterListIcon className={classes.iconButton} />
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{propertyLabel}</DialogTitle>
          <DialogContent>
            <CheckboxList
              list={resultValues}
              property={property}
              updateResultsFilter={this.props.updateResultsFilter}
            />
          </DialogContent>

        </Dialog>
      </div>
    );
  }
}


ResultFilterDialogSingle.propTypes = {
  classes: PropTypes.object.isRequired,
  propertyLabel: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  resultValues: PropTypes.array,
  updateResultsFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(ResultFilterDialogSingle);
