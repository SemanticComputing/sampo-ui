import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import GeneralDialog from '../main_layout/GeneralDialog'
import ApexChart from '../facet_results/ApexChart'
import { makeStyles } from '@material-ui/core/styles'

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
    fetchData, facetID, rawData, rawDataUpdateID, createChartData, facetClass,
    resultClass, fetching, tooltip, title, xaxisTitle, yaxisTitle, seriesTitle, lineChartConfig,
    layoutConfig
  } = props
  let xaxisType = null; let xaxisTickAmount = null; let stroke = null
  if (lineChartConfig) {
    ({ xaxisType, xaxisTickAmount, stroke } = lineChartConfig)
  }
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip disableFocusListener title={tooltip}>
        <IconButton
          aria-label={tooltip}
          aria-owns={open ? 'facet-option-menu' : undefined}
          aria-haspopup='true'
          onClick={handleClickOpen}
        >
          {props.icon}
        </IconButton>
      </Tooltip>
      <GeneralDialog
        open={open}
        onClose={handleClose}
        dialogTitle={props.dialogTitle}
      >
        <div className={classes.chartContainer}>
          <ApexChart
            pageType='dialog'
            facetID={facetID}
            resultClass={resultClass}
            facetClass={facetClass}
            fetchData={fetchData}
            fetching={fetching}
            rawData={rawData}
            rawDataUpdateID={rawDataUpdateID}
            createChartData={createChartData}
            title={title}
            xaxisTitle={xaxisTitle}
            yaxisTitle={yaxisTitle}
            seriesTitle={seriesTitle}
            xaxisType={xaxisType}
            xaxisTickAmount={xaxisTickAmount}
            stroke={stroke}
            layoutConfig={layoutConfig}
          />
        </div>
      </GeneralDialog>
    </>
  )
}

ChartDialog.propTypes = {
  /**
   * The input data.
   */
  rawData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  /**
   * An ID to detect if the raw data has changed.
   */
  rawDataUpdateID: PropTypes.number.isRequired,
  /**
   * Redux action for fetching the raw data.
   */
  fetchData: PropTypes.func,
  /**
   * Function for creating chart data from raw data
   */
  createChartData: PropTypes.func.isRequired,
  /**
    Loading indicator.
   */
  fetching: PropTypes.bool.isRequired,
  /**
   * Unique id of the facet.
   * Used with e.g. 'fetchFacetConstrainSelf' action.
   */
  facetID: PropTypes.string,
  /**
   * The class of the facets for server-side configs.
   */
  facetClass: PropTypes.string,
  /**
   * The class of results for server-side configs.
   */
  resultClass: PropTypes.string,
  /**
   * Tooltip text.
   */
  tooltip: PropTypes.string.isRequired,
  xaxisTitle: PropTypes.string,
  yaxisTitle: PropTypes.string,
  seriesTitle: PropTypes.string
}

export default ChartDialog
