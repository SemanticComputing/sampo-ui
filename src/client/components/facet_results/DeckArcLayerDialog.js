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
    classes, onClose, data, from, to, fromText, toText,
    listHeadingSingleInstance, listHeadingMultipleInstances
  } = props

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      open
      onClose={onClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogContent>
        <>
          <Typography>{fromText} &nbsp;
            <Link to={from.dataProviderUrl}>
              {Array.isArray(from.prefLabel) ? from.prefLabel[0] : from.prefLabel}
            </Link>
          </Typography>
          <Typography>{toText} &nbsp;
            <Link to={to.dataProviderUrl}>
              {Array.isArray(to.prefLabel) ? to.prefLabel[0] : to.prefLabel}
            </Link>
          </Typography>
          <InstanceList
            data={data}
            listHeadingSingleInstance={listHeadingSingleInstance}
            listHeadingMultipleInstances={listHeadingMultipleInstances}
          />
        </>
      </DialogContent>
    </Dialog>
  )
}

DeckArcLayerDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  fromText: PropTypes.string.isRequired,
  toText: PropTypes.string.isRequired,
  listHeadingSingleInstance: PropTypes.string.isRequired,
  listHeadingMultipleInstances: PropTypes.string.isRequired
}

export default withStyles(styles)(DeckArcLayerDialog)
