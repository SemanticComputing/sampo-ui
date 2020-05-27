import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ApexCharts from 'apexcharts'
// import Paper from '@material-ui/core/Paper'
import purple from '@material-ui/core/colors/purple'
import CircularProgress from '@material-ui/core/CircularProgress'

// http://phrogz.net/css/distinct-colors.html
const colors = ['#a12a3c', '#0f00b5', '#81c7a4', '#ffdea6', '#ff0033', '#424cff', '#1b6935', '#ff9d00', '#5c3c43',
  '#5f74b8', '#18b532', '#3b3226', '#fa216d', '#153ca1', '#00ff09', '#703a00', '#b31772', '#a4c9fc', '#273623',
  '#f57200', '#360e2c', '#001c3d', '#ccffa6', '#a18068', '#ba79b6', '#004e75', '#547500', '#c2774c', '#f321fa', '#1793b3',
  '#929c65', '#b53218', '#563c5c', '#1ac2c4', '#c4c734', '#4c150a', '#912eb3', '#2a5252', '#524b00', '#bf7d7c', '#24005e',
  '#20f2ba', '#b5882f']

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
 * A component for rendering charts, based on ApexCharts.
 */
class ApexChart extends React.Component {
  constructor (props) {
    super(props)
    this.chartRef = React.createRef()
  }

  componentDidMount () {
    if (this.props.data.length > 0) {
      this.renderChart()
    }
    this.props.fetchFacetConstrainSelf({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID
    })
  }

  componentDidUpdate (prevProps) {
    // Render the chart when data changes
    if (prevProps.data !== this.props.data) {
      this.renderChart()
    }
  }

  componentWillUnmount () {
    if (!this.chart == null) {
      this.chart.destroy()
    }
  }

  renderChart = () => {
    const labels = []
    const series = []
    let otherCount = 0
    const totalLength = this.props.data.length
    const threshold = 0.15
    let sum = 0
    this.props.data.map(item => {
      const portion = parseInt(item.instanceCount) / totalLength
      sum += item.instanceCount
      if (portion < threshold) {
        otherCount += parseInt(item.instanceCount)
      } else {
        labels.push(item.prefLabel)
        series.push(parseInt(item.instanceCount))
      }
    })
    if (otherCount !== 0) {
      labels.push('Other')
      series.push(otherCount)
    }
    let chartColors = []
    if (series.length > colors.length) {
      const quotient = Math.ceil(series.length / colors.length)
      for (let i = 0; i < quotient; i++) {
        chartColors = chartColors.concat(colors)
      }
    } else {
      chartColors = colors
    }
    chartColors = chartColors.slice(0, series.length)
    const options = {
      ...this.props.options,
      series,
      labels,
      colors: chartColors,
      sum
    }
    // Destroy the previous chart
    if (!this.chart == null) {
      this.chart.destroy()
    }
    this.chart = new ApexCharts(
      this.chartRef.current,
      options
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
  fetching: PropTypes.bool.isRequired,
  data: PropTypes.array,
  options: PropTypes.object.isRequired,
  fetchResults: PropTypes.func,
  fetchFacetConstrainSelf: PropTypes.func,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  facetID: PropTypes.string
}

export const ApexChartComponent = ApexChart

export default withStyles(styles)(ApexChart)
