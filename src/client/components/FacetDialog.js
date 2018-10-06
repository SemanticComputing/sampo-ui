import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';

const styles = () => ({
  root: {
    display: 'inline'
  },
});

class FacetDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.props.fetchFacet(this.props.property);
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, propertyLabel, facetValues } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleClickOpen}
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
            <Tree data={facetValues} />
          </DialogContent>

        </Dialog>
      </div>
    );
  }
}


FacetDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  propertyLabel: PropTypes.string.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facetValues: PropTypes.array.isRequired,
};

export default withStyles(styles)(FacetDialog);
