import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import GeneralDialog from '../main_layout/GeneralDialog'
import ApexChart from '../facet_results/ApexChart'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  chartContainer: {
    height: 'calc(100% - 30px)',
    paddingRight: theme.spacing(1)
  }
}))

/**
 * A component for displaying an ApexChart in a Material-UI Dialog.
 * A Dialog is a type of modal window that appears in front of app content.
 */
const ChartDialog = props => {
  const [open, setOpen] = React.useState(false)
  const { fetchData, facetID, rawData, rawDataUpdateID, createChartData, facetClass, resultClass, fetching } = props
  const classes = useStyles()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip disableFocusListener title='Chart'>
        <IconButton
          aria-label='Chart'
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
  resultClass: PropTypes.string
}

export default ChartDialog
