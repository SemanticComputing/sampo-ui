import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import CropFreeIcon from '@material-ui/icons/CropFree'
import LeafletMap from '../facet_results/LeafletMap'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    marginBottom: theme.spacing(1)
  },
  dialogContainer: {
    height: '100%',
    width: '100%'
  },
  dialogPaper: {
    height: '100%',
    width: '100%'
  },
  mapSearch: {
    margin: theme.spacing(1)
  },
  buttonLabel: {
    fontWeigth: 'normal',
    textTransform: 'none'
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
})

/**
 * A component for displaying a Leaflet map in a Material-UI Dialog.
 */
class LeafletMapDialog extends React.Component {
  state = {
    open: false,
    zoomMessage: ''
  };

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  handleSearchByArea = () => {
    if (this.props.map.zoomLevel > 10) {
      this.props.clientFSClearResults()
      this.props.clientFSFetchResults({ jenaIndex: 'spatial' })
      this.setState({ open: false })
    } else {
      this.props.showError({
        title: '',
        text: intl.get('leafletMap.wrongZoomLevel')
      })
    }
  }

  render () {
    const { classes, perspectiveID } = this.props

    return (
      <Paper className={classes.root}>
        <Button
          variant='contained'
          color='primary'
          className={classes.mapSearch}
          classes={{ label: classes.buttonLabel }}
          onClick={this.handleClickOpen}
        >
          {intl.get(`perspectives.${perspectiveID}.searchByArea`)}
          {this.props.fetching
            ? <CircularProgress className={classes.rightIcon} color='inherit' size={24} />
            : <CropFreeIcon className={classes.rightIcon} />}
        </Button>

        <Dialog
          classes={{
            container: classes.dialogContainer,
            paper: classes.dialogPaper
          }}
          maxWidth={false}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='dialog-title'
        >
          <DialogTitle id='dialog-title'>{intl.get(`perspectives.${perspectiveID}.searchByAreaTitle`)}</DialogTitle>
          <LeafletMap
            center={[65.184809, 27.314050]}
            zoom={5}
            pageType='clientFSResults'
            showMapModeControl={false}
            showInstanceCountInClusters={false}
            showExternalLayers={false}
            fetching={false}
            facetedSearchMode='clientFS'
            updateMapBounds={this.props.updateMapBounds}
            container='mapDialog'
          />
          <DialogActions>
            <Button onClick={this.handleClose} variant='contained' color='primary' autoFocus>
              {intl.get(`perspectives.${perspectiveID}.searchByAreaCancel`)}
            </Button>
            <Button onClick={this.handleSearchByArea} variant='contained' color='primary' autoFocus>
              {intl.get(`perspectives.${perspectiveID}.searchByAreaSearch`)}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    )
  }
}

LeafletMapDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  strings: PropTypes.object,
  map: PropTypes.object.isRequired,
  getGeoJSON: PropTypes.func,
  updateMapBounds: PropTypes.func,
  clientFSFetchResults: PropTypes.func.isRequired,
  clientFSClearResults: PropTypes.func.isRequired,
  showError: PropTypes.func,
  fetching: PropTypes.bool,
  perspectiveID: PropTypes.string.isRequired
}

export const LeafletMapDialogComponent = LeafletMapDialog

export default withStyles(styles)(LeafletMapDialog)
