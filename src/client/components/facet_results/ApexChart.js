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
    alignItems: 'center'
  },
  formControl: {
    marginLeft: 8
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
      resultClass: props.resultClass
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
      this.props.createChartData({
        rawData: this.props.rawData,
        title: this.props.title,
        xaxisTitle: this.props.xaxisTitle || '',
        yaxisTitle: this.props.yaxisTitle || '',
        seriesTitle: this.props.seriesTitle || ''
      })
    )
    this.chart.render()
  }

  handleSelectOnChanhge = event => this.setState({ resultClass: event.target.value })

  render () {
    const { fetching, pageType, classes, facetResultsType, dropdownForResultClasses } = this.props
    const facetResultsTypeCapitalized = facetResultsType[0].toUpperCase() + facetResultsType.substring(1).toLowerCase()
    let rootStyle = {
      width: '100%',
      height: '100%'
    }
    if (pageType === 'facetResults' || pageType === 'instancePage') {
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
        {dropdownForResultClasses &&
          <div className={classes.selectContainer}>
            <Typography>{facetResultsTypeCapitalized} {intl.get('pieChart.by')}</Typography>
            <FormControl className={classes.formControl}>
              <Select
                id='select-result-class'
                value={this.state.resultClass}
                onChange={this.handleSelectOnChanhge}
              >
                {this.props.resultClasses.map(resultClass =>
                  <MenuItem key={resultClass} value={resultClass}>{intl.get(`pieChart.resultClasses.${resultClass}`)}</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>}
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
  facetID: PropTypes.string,
  uri: PropTypes.string,
  dropdownForResultClasses: PropTypes.bool,
  facetResultsType: PropTypes.string,
  resultClasses: PropTypes.array
}

export default withStyles(styles)(ApexChart)
