import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import GeneralDialog from '../main_layout/GeneralDialog'
import ApexCharts from '../facet_results/ApexCharts'
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  chartContainer: {
    height: 'calc(100% - 100px)',
    padding: theme.spacing(1)
  }
}))

/**
 * A component for displaying an ApexChart in a Material-UI Dialog.
 * A Dialog is a type of modal window that appears in front of app content.
 */
const ChartDialog = props => {
  const {
    results, resultUpdateID, fetching, tooltip, resultClassConfig, fetchData,
    facetClass, resultClass = null, facetID
  } = props
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return <>
    <Tooltip disableFocusListener title={tooltip}>
      <IconButton
        aria-label={tooltip}
        aria-owns={open ? 'facet-option-menu' : undefined}
        aria-haspopup='true'
        onClick={handleClickOpen}
        size="large">
        {props.icon}
      </IconButton>
    </Tooltip>
    <GeneralDialog
      open={open}
      onClose={handleClose}
      dialogTitle={props.dialogTitle}
    >
      <div className={classes.chartContainer}>
        <ApexCharts
          portalConfig={props.portalConfig}
          perspectiveConfig={props.perspectiveConfig}
          apexChartsConfig={props.apexChartsConfig}
          results={results}
          resultUpdateID={resultUpdateID}
          fetching={fetching}
          fetchData={fetchData}
          resultClass={resultClass}
          facetClass={facetClass}
          facetID={facetID}
          resultClassConfig={resultClassConfig}
        />
      </div>
    </GeneralDialog>
  </>;
}

ChartDialog.propTypes = {
  /**
   * The input data.
   */
  results: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  /**
   * An ID to detect if the raw data has changed.
   */
  resultUpdateID: PropTypes.number.isRequired,
  /**
   * Redux action for fetching the raw data.
   */
  fetchData: PropTypes.func,
  /**
    Loading indicator.
   */
  fetching: PropTypes.bool.isRequired,
  /**
   * The class of the facets.
   */
  facetClass: PropTypes.string,
  /**
   * Tooltip text.
   */
  tooltip: PropTypes.string.isRequired
}

export default ChartDialog
