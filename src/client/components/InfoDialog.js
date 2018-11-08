import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import ManuscriptList from './ManuscriptList';

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

const InfoDialog = (props) => {
  const { classes, open, onClose, data } = props;
  //console.log(data)

  let content = '';
  if (data.from) {
    const fromSdbm = data.from.id.replace('http://ldf.fi/mmm/place/', 'https://sdbm.library.upenn.edu/places/');
    if (Array.isArray(data.to)) {
      data.to = data.to[0];
    }
    const toSdbm = data.to.id.replace('http://ldf.fi/mmm/place/', 'https://sdbm.library.upenn.edu/places/');
    content = (
      <DialogContent>
        <p>Creation place: <a target="_blank" rel="noopener noreferrer" href={fromSdbm}>{data.from.name}</a></p>
        <p>Most recently observed location: <a target="_blank" rel="noopener noreferrer" href={toSdbm}>{data.to.name}</a></p>
        <ManuscriptList manuscripts={data.manuscript} />
      </DialogContent>
    );
  }

  return (
    <div className={classes.root}>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        {content}
      </Dialog>
    </div>
  );
};

InfoDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(InfoDialog);
