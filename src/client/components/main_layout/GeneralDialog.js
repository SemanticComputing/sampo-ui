import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import MuiDialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import withStyles from '@mui/styles/withStyles'

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
    <MuiDialogTitle
      sx={theme => ({
        paddingTop: theme.spacing(1),
        paddingBottom: 0
      })}
      {...other}
    >
      {children}
      {onClose
        ? (
          <IconButton
            aria-label='close'
            className={classes.closeButton}
            onClick={onClose}
            size='large'
          >
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
