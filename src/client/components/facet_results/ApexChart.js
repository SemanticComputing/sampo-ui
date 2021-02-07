import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { withStyles } from '@material-ui/core/styles'
import ApexCharts from 'apexcharts'
import purple from '@material-ui/core/colors/purple'
import CircularProgress from '@material-ui/core/CircularProgress'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  formControl: {
    marginLeft: theme.spacing(1)
  }
})

/**
 * A component for rendering charts with ApexCharts.
 */
class ApexChart extends React.Component {
  constructor (props) {
    super(props)
    this.chartRef = React.createRef()
    this.state = {
      resultClass: props.resultClass,
      createChartData: props.createChartData,
      chartType: props.dropdownForChartTypes ? props.chartTypes[0].id : null
    }
  }

  componentDidMount = () => {
    if (this.props.rawData && this.props.rawData.length > 0) {
      this.renderChart()
    }
    this.props.fetchData({
      resultClass: this.state.resultClass,
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      uri: this.props.uri
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    // Render the chart again if the raw data has changed
    if (prevProps.rawDataUpdateID !== this.props.rawDataUpdateID) {
      this.renderChart()
    }
    // check if filters have changed
    if (this.props.pageType === 'facetResults' && prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchData({
        resultClass: this.state.resultClass,
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
    }
    if (prevState.resultClass !== this.state.resultClass) {
      this.props.fetchData({
        resultClass: this.state.resultClass,
        facetClass: this.props.facetClass,
        facetID: this.props.facetID
      })
    }
    if (prevState.chartType !== this.state.chartType) {
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
    if (this.chart !== undefined) {
      this.chart.destroy()
    }
    this.chart = new ApexCharts(
      this.chartRef.current,
      this.state.createChartData({
        rawData: this.props.rawData,
        title: this.props.title,
        xaxisTitle: this.props.xaxisTitle || '',
        yaxisTitle: this.props.yaxisTitle || '',
        seriesTitle: this.props.seriesTitle || ''
      })
    )
    this.chart.render()
  }

  handleResultClassOnChanhge = event => this.setState({ resultClass: event.target.value })

  handleChartTypeOnChanhge = event => {
    const chartType = event.target.value
    const chartTypeObj = this.props.chartTypes.find(chartTypeObj => chartTypeObj.id === chartType)
    this.setState({
      chartType,
      createChartData: chartTypeObj.createChartData
    })
  }

  render () {
    const { fetching, pageType, classes, facetResultsType, dropdownForResultClasses, dropdownForChartTypes } = this.props
    const rootHeightReduction = 136 // tabs + padding
    let chartHeightReduction = 0
    let facetResultsTypeCapitalized
    if (dropdownForResultClasses) {
      facetResultsTypeCapitalized = facetResultsType[0].toUpperCase() + facetResultsType.substring(1).toLowerCase()
      chartHeightReduction += 40 // dropdown height
    }
    if (dropdownForChartTypes) {
      chartHeightReduction += 40 // dropdown height
    }
    let rootStyle = {
      width: '100%',
      height: '100%'
    }
    if (pageType === 'facetResults' || pageType === 'instancePage') {
      rootStyle = {
        height: `calc(100% - ${rootHeightReduction}px)`,
        width: 'calc(100% - 64px)',
        padding: 32,
        backgroundColor: '#fff',
        borderTop: '1px solid rgba(224, 224, 224, 1)'
      }
    }
    const spinnerContainerStyle = {
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const chartContainerStyle = {
      width: '100%',
      height: `calc(100% - ${chartHeightReduction}px)`
    }
    return (
      <div style={rootStyle}>
        {dropdownForResultClasses &&
          <div className={classes.selectContainer}>
            <Typography>{facetResultsTypeCapitalized} {intl.get('pieChart.by')}</Typography>
            <FormControl className={classes.formControl}>
              <Select
                id='select-result-class'
                value={this.state.resultClass}
                onChange={this.handleResultClassOnChanhge}
              >
                {this.props.resultClasses.map(resultClass =>
                  <MenuItem key={resultClass} value={resultClass}>{intl.get(`pieChart.resultClasses.${resultClass}`)}</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>}
        {dropdownForChartTypes &&
          <div className={classes.selectContainer}>
            <Typography>{intl.get('pieChart.chartType')}</Typography>
            <FormControl className={classes.formControl}>
              <Select
                id='select-chart-type'
                value={this.state.chartType}
                onChange={this.handleChartTypeOnChanhge}
              >
                {this.props.chartTypes.map(chartType =>
                  <MenuItem key={chartType.id} value={chartType.id}>{intl.get(`pieChart.${chartType.id}`)}</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>}
        {fetching &&
          <div style={spinnerContainerStyle}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>}
        {!fetching &&
          <div style={chartContainerStyle}>
            <div ref={this.chartRef} />
          </div>}
      </div>
    )
  }
}

ApexChart.propTypes = {
  pageType: PropTypes.string.isRequired,
  createChartData: PropTypes.func,
  rawData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  rawDataUpdateID: PropTypes.number,
  fetchData: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  resultClass: PropTypes.string,
  facetClass: PropTypes.string,
  facetID: PropTypes.string,
  uri: PropTypes.string,
  dropdownForResultClasses: PropTypes.bool,
  facetResultsType: PropTypes.string,
  resultClasses: PropTypes.array
}

export default withStyles(styles)(ApexChart)
