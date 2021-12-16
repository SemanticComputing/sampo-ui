import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  dialogPaper: {
    height: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose
        ? (
          <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          )
        : null}
    </MuiDialogTitle>
  )
})

const GeneralDialog = props => {
  const { onClose, open, children, classes, dialogTitle = '' } = props

  return (
    <Dialog
      classes={{
        paper: classes.dialogPaper
      }}
      onClose={onClose}
      aria-labelledby='simple-dialog-title'
      open={open}
      fullWidth
      maxWidth='xl'
    >
      <DialogTitle id='customized-dialog-title' onClose={onClose}>
        {dialogTitle}
      </DialogTitle>
      {children}
    </Dialog>
  )
}

GeneralDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node
}

export default withStyles(styles)(GeneralDialog)
