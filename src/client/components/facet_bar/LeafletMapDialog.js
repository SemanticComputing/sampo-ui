import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import intl from 'react-intl-universal'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import CropFreeIcon from '@mui/icons-material/CropFree'
import LeafletMap from '../facet_results/LeafletMap'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'

const styles = theme => ({
  dialogContainer: {
    height: '100%',
    width: '100%'
  },
  dialogPaper: {
    height: '100%',
    width: '100%'
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
    if (this.props.clientFSState.maps.boundingboxSearch.zoom > 10) {
      this.props.clientFSClearResults()
      this.props.clientFSFetchResults({
        perspectiveID: this.props.perspectiveID,
        jenaIndex: 'spatial'
      })
      this.setState({ open: false })
    } else {
      this.props.showError({
        title: '',
        text: intl.get('leafletMap.wrongZoomLevel')
      })
    }
  }

  render () {
    const { classes, clientFSState, perspectiveID, portalConfig } = this.props
    const { maps, spatialResultsFetching } = clientFSState
    const { center, zoom } = maps.boundingboxSearch

    return (
      <Paper
        sx={theme => ({
          padding: theme.spacing(1),
          [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(1)
          }
        })}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={this.handleClickOpen}
          sx={{
            fontWeigth: 'normal',
            textTransform: 'none'
          }}
        >
          {intl.get(`perspectives.${perspectiveID}.searchByArea`)}
          {spatialResultsFetching
            ? <CircularProgress className={classes.rightIcon} size={24} />
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
            portalConfig={portalConfig}
            center={center}
            zoom={zoom}
            resultClass='boundingboxSearch'
            pageType='clientFSResults'
            showMapModeControl={false}
            showInstanceCountInClusters={false}
            showExternalLayers={false}
            fetching={false}
            facetedSearchMode='clientFS'
            updateMapBounds={this.props.updateMapBounds}
            container='mapDialog'
            layoutConfig={this.props.layoutConfig}
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
  clientFSState: PropTypes.object.isRequired,
  clientFSFetchResults: PropTypes.func.isRequired,
  clientFSClearResults: PropTypes.func.isRequired,
  updateMapBounds: PropTypes.func,
  showError: PropTypes.func,
  perspectiveID: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export const LeafletMapDialogComponent = LeafletMapDialog

export default withStyles(styles)(LeafletMapDialog)
