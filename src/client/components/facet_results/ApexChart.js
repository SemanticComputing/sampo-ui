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
import GeneralDialog from '../main_layout/GeneralDialog'
import InstaceList from '../main_layout/InstanceList'

const defaultPadding = 32
const smallScreenPadding = 8

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
      chartType: props.dropdownForChartTypes ? props.chartTypes[0].id : null,
      dialogData: null
    }
  }

  componentDidMount = () => {
    if (this.props.rawData && this.props.rawData.length > 0 && !this.props.doNotRenderOnMount) {
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
    if (prevProps.screenSize !== this.props.screenSize) {
      this.renderChart()
    }
    if (prevProps.instanceAnalysisDataUpdateID !== this.props.instanceAnalysisDataUpdateID) {
      this.setState({
        dialogData: this.props.instanceAnalysisData
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
    if (this.chart !== undefined) {
      this.chart.destroy()
    }
    this.chart = new ApexCharts(
      this.chartRef.current,
      this.state.createChartData({
        rawData: this.props.rawData,
        title: this.props.title,
        xaxisTitle: this.props.xaxisTitle || intl.get(`apexCharts.${this.state.resultClass}Xaxis`),
        yaxisTitle: this.props.yaxisTitle || '',
        seriesTitle: this.props.seriesTitle || '',
        xaxisType: this.props.xaxisType || null,
        xaxisTickAmount: this.props.xaxisTickAmount || null,
        xaxisLabels: this.props.xaxisLabels || null,
        stroke: this.props.stroke || null,
        fill: this.props.fill || null,
        tooltip: this.props.tooltip || null,
        fetchInstanceAnalysis: this.props.fetchInstanceAnalysis,
        resultClass: this.props.resultClass,
        facetID: this.props.facetID,
        facetClass: this.props.facetClass,
        screenSize: this.props.screenSize
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

  handleDialogOnClose = event => this.setState({ dialogData: null })

  isSmallScreen = () => {
    const { screenSize } = this.props
    return screenSize === 'xs' || screenSize === 'sm'
  }

  getHeightForRootContainer = () => {
    if (this.isSmallScreen()) {
      return 'auto'
    }
    const rootHeightReduction = this.props.layoutConfig.tabHeight + 2 * defaultPadding + 1
    return `calc(100% - ${rootHeightReduction}px)`
  }

  getHeightForChartContainer = () => {
    const { dropdownForResultClasses, dropdownForChartTypes } = this.props
    if (this.isSmallScreen()) {
      return 600
    }
    let chartHeightReduction = 0
    if (dropdownForResultClasses) {
      chartHeightReduction += 40 // dropdown height
    }
    if (dropdownForChartTypes) {
      chartHeightReduction += 40 // dropdown height
    }
    return `calc(100% - ${chartHeightReduction}px)`
  }

  render () {
    const {
      fetching, pageType, classes, dropdownForResultClasses,
      dropdownForChartTypes, facetResultsType
    } = this.props
    let facetResultsTypeCapitalized = ''
    if (facetResultsType) {
      facetResultsTypeCapitalized = facetResultsType[0].toUpperCase() + facetResultsType.substring(1).toLowerCase()
    }
    let rootStyle = {
      width: '100%',
      height: '100%'
    }
    if (pageType === 'facetResults' || pageType === 'instancePage') {
      const padding = this.isSmallScreen() ? smallScreenPadding : defaultPadding
      rootStyle = {
        height: this.getHeightForRootContainer(),
        width: `calc(100% - ${2 * padding}px)`,
        padding: padding,
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
      height: this.getHeightForChartContainer()
    }
    let dropdownText = intl.get('apexCharts.by') === ''
      ? intl.get('apexCharts.grouping')
      : `${facetResultsTypeCapitalized} ${intl.get('apexCharts.by')}`
    if (this.props.xaxisType === 'numeric') {
      dropdownText = intl.get('apexCharts.property')
    }
    return (
      <div style={rootStyle}>
        {dropdownForResultClasses &&
          <div className={classes.selectContainer}>
            <Typography>{dropdownText}</Typography>
            <FormControl className={classes.formControl}>
              <Select
                id='select-result-class'
                value={this.state.resultClass}
                onChange={this.handleResultClassOnChanhge}
              >
                {this.props.resultClasses.map(resultClass =>
                  <MenuItem key={resultClass} value={resultClass}>{intl.get(`apexCharts.resultClasses.${resultClass}`)}</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>}
        {dropdownForChartTypes &&
          <div className={classes.selectContainer}>
            <Typography>{intl.get('apexCharts.chartType')}</Typography>
            <FormControl className={classes.formControl}>
              <Select
                id='select-chart-type'
                value={this.state.chartType}
                onChange={this.handleChartTypeOnChanhge}
              >
                {this.props.chartTypes.map(chartType =>
                  <MenuItem key={chartType.id} value={chartType.id}>{intl.get(`apexCharts.${chartType.id}`)}</MenuItem>
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
        {this.state.dialogData &&
          <GeneralDialog open maxWidth='sm' onClose={this.handleDialogOnClose}>
            <Typography><b>Maakunta:</b> {this.state.dialogData[0].selectedProvinceLabel}</Typography>
            <Typography><b>Aikakausi:</b> {this.state.dialogData[0].selectedPeriodLabel}</Typography>
            <InstaceList
              data={this.state.dialogData}
              listHeadingSingleInstance={this.props.listHeadingSingleInstance}
              listHeadingMultipleInstances={this.props.listHeadingMultipleInstances}
            />
          </GeneralDialog>}
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
  resultClasses: PropTypes.array,
  layoutConfig: PropTypes.object.isRequired
}

export const ApexChartComponent = ApexChart

export default withStyles(styles)(ApexChart)
