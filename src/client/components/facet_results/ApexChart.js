import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ApexCharts from 'apexcharts'
// import Paper from '@material-ui/core/Paper'
import purple from '@material-ui/core/colors/purple'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = () => ({
  root: {
    width: '100%',
    height: '100%'
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
/**
 * A component for rendering charts with ApexCharts.
 */
class ApexChart extends React.Component {
  constructor (props) {
    super(props)
    this.chartRef = React.createRef()
  }

  componentDidMount = () => {
    if (this.props.rawData && this.props.rawData.length > 0) {
      this.renderChart()
    }
    this.props.fetchData({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      facetID: this.props.facetID
    })
  }

  componentDidUpdate = prevProps => {
    // Render the chart again if the raw data has changed
    if (prevProps.rawDataUpdateID !== this.props.rawDataUpdateID) {
      this.renderChart()
    }
  }

  componentWillUnmount () {
    if (!this.chart == null) {
      this.chart.destroy()
    }
  }

  renderChart = () => {
    // Destroy the previous chart
    if (!this.chart == null) {
      this.chart.destroy()
    }
    this.chart = new ApexCharts(
      this.chartRef.current,
      this.props.createChartData(this.props.rawData)
    )
    this.chart.render()
  }

  render () {
    const { classes, fetching } = this.props
    return (
      <div className={classes.root}>
        {fetching &&
          <div className={this.props.classes.spinnerContainer}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>}
        {!fetching &&
          <div className={classes.chart} ref={this.chartRef} />}
      </div>
    )
  }
}

ApexChart.propTypes = {
  classes: PropTypes.object.isRequired,
  createChartData: PropTypes.func.isRequired,
  rawData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  rawDataUpdateID: PropTypes.number,
  fetchData: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  facetID: PropTypes.string
}

export const ApexChartComponent = ApexChart

export default withStyles(styles)(ApexChart)
