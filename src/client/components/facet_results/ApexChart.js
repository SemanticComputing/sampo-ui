import React from 'react'
import PropTypes from 'prop-types'
import ApexCharts from 'apexcharts'
// import Paper from '@material-ui/core/Paper'
import purple from '@material-ui/core/colors/purple'
import CircularProgress from '@material-ui/core/CircularProgress'

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
    // check if filters have changed
    if (this.props.pageType === 'facetResults' && prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchData({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
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
    const { fetching, pageType } = this.props
    let rootStyle = {
      width: '100%',
      height: '100%'
    }
    if (pageType === 'facetResults') {
      rootStyle = {
        height: 'calc(100% - 136px)',
        width: 'calc(100% - 64px)',
        padding: 32,
        backgroundColor: '#fff',
        borderTop: '1px solid rgba(224, 224, 224, 1)'
      }
    }
    const spinnerContainerStyle = {
      ...rootStyle,
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }
    return (
      <div style={rootStyle}>
        {fetching &&
          <div style={spinnerContainerStyle}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>}
        {!fetching &&
          <div ref={this.chartRef} />}
      </div>
    )
  }
}

ApexChart.propTypes = {
  pageType: PropTypes.string.isRequired,
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

export default ApexChart
