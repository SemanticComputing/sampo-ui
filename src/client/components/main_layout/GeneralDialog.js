import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    display: 'inline'
  },
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '60vh',
  },
});

const GeneralDialog = props => {
  const { classes, open, onClose, /*data*/ } = props;
  //console.log(data)

  return (
    <div className={classes.root}>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Test title</DialogTitle>
        <DialogContent><Typography>test</Typography></DialogContent>
      </Dialog>
    </div>
  );
};

GeneralDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(GeneralDialog);
