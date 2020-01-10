import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import PieChartIcon from '@material-ui/icons/PieChart'
import Tooltip from '@material-ui/core/Tooltip'
import GeneralDialog from '../main_layout/GeneralDialog'
import ApexChart from '../facet_results/ApexChart'

const ChartDialog = props => {
  const [open, setOpen] = React.useState(false)
  const { fetchFacetConstrainSelf, facetID, facetClass, data, fetching } = props

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
          <PieChartIcon />
        </IconButton>
      </Tooltip>
      <GeneralDialog
        open={open}
        onClose={handleClose}
      >
        <ApexChart
          facetID={facetID}
          facetClass={facetClass}
          fetchFacetConstrainSelf={fetchFacetConstrainSelf}
          data={data}
          fetching={fetching}
          options={{
            chart: {
              type: 'pie',
              width: '100%',
              height: '100%',
              // parentHeightOffset: 0,
              fontFamily: 'Roboto'
            },
            legend: {
              position: 'right',
              width: 400,
              fontSize: 16,
              itemMargin: {
                horizontal: 5
              },
              onItemHover: {
                highlightDataSeries: false
              },
              onItemClick: {
                toggleDataSeries: false
              },
              markers: {
                width: 18,
                height: 18
              },
              formatter: (seriesName, opts) => {
                return `${seriesName} [${opts.w.globals.series[opts.seriesIndex]}]`
              }
            },
            tooltip: {
              // enabled: false,
              followCursor: false,
              fixed: {
                enabled: true,
                position: 'topRight'
              }
            }
          }}
        />
      </GeneralDialog>
    </>
  )
}

ChartDialog.propTypes = {
  facetID: PropTypes.string,
  facetClass: PropTypes.string,
  data: PropTypes.array,
  fetching: PropTypes.bool.isRequired,
  fetchFacetConstrainSelf: PropTypes.func
}

export default ChartDialog
