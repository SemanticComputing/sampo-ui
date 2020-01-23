import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ManuscriptList from './ManuscriptList'
import { Link } from 'react-router-dom'

const styles = () => ({
  root: {
    display: 'inline'
  },
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '60vh'
  }
})

const InfoDialog = (props) => {
  const { classes, open, onClose, data } = props
  const hasData = data !== null && data.from && data.to && data.manuscript

  return (
    <div className={classes.root}>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={open}
        onClose={onClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogContent>
          {hasData &&
            <>
              <Typography>Production place: &nbsp;
                <Link to={data.from.dataProviderUrl}>
                  {Array.isArray(data.from.prefLabel) ? data.from.prefLabel[0] : data.from.prefLabel}
                </Link>
              </Typography>
              <Typography>Last known location: &nbsp;
                <Link to={data.to.dataProviderUrl}>
                  {Array.isArray(data.to.prefLabel) ? data.to.prefLabel[0] : data.to.prefLabel}
                </Link>
              </Typography>
              <ManuscriptList manuscripts={data.manuscript} />
            </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

InfoDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object
}

export default withStyles(styles)(InfoDialog)
