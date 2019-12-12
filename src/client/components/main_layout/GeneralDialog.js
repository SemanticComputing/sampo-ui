import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  dialogPaper: {
    height: '100%'
  }
});

const GeneralDialog = props => {
  const { onClose, open, children, classes } = props;

  return (
    <Dialog
      classes={{
        paper: classes.dialogPaper
      }}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth='xl'
    >
      {children}
    </Dialog>
  );
};

GeneralDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node
};

export default withStyles(styles)(GeneralDialog);
