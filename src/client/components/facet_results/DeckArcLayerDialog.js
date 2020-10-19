import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import InstanceList from '../main_layout/InstanceList'
import { Link } from 'react-router-dom'

const styles = () => ({
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '60vh'
  }
})

const DeckArcLayerDialog = props => {
  const {
    classes, open, onClose, data, fromText, toText,
    listHeadingSingleInstance, listHeadingMultipleInstances
  } = props
  const hasData = data !== null && data.from && data.to && data.manuscript

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      open={open}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogContent>
        {hasData &&
          <>
            <Typography>{fromText} &nbsp;
              <Link to={data.from.dataProviderUrl}>
                {Array.isArray(data.from.prefLabel) ? data.from.prefLabel[0] : data.from.prefLabel}
              </Link>
            </Typography>
            <Typography>{toText} &nbsp;
              <Link to={data.to.dataProviderUrl}>
                {Array.isArray(data.to.prefLabel) ? data.to.prefLabel[0] : data.to.prefLabel}
              </Link>
            </Typography>
            <InstanceList
              data={data.manuscript}
              listHeadingSingleInstance={listHeadingSingleInstance}
              listHeadingMultipleInstances={listHeadingMultipleInstances}
            />
          </>}
      </DialogContent>
    </Dialog>
  )
}

DeckArcLayerDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  fromText: PropTypes.string.isRequired,
  toText: PropTypes.string.isRequired,
  listHeadingSingleInstance: PropTypes.string.isRequired,
  listHeadingMultipleInstances: PropTypes.string.isRequired
}

export default withStyles(styles)(DeckArcLayerDialog)
