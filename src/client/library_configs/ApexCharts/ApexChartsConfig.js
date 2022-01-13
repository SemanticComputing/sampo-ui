
import intl from 'react-intl-universal'
import { generateLabelForMissingValue } from '../../helpers/helpers'

// list of colors generated with http://phrogz.net/css/distinct-colors.html
const pieChartColors = ['#a12a3c', '#0f00b5', '#81c7a4', '#ffdea6', '#ff0033', '#424cff', '#1b6935', '#ff9d00', '#5c3c43',
  '#5f74b8', '#18b532', '#3b3226', '#fa216d', '#153ca1', '#00ff09', '#703a00', '#b31772', '#a4c9fc', '#273623',
  '#f57200', '#360e2c', '#001c3d', '#ccffa6', '#a18068', '#ba79b6', '#004e75', '#547500', '#c2774c', '#f321fa', '#1793b3',
  '#929c65', '#b53218', '#563c5c', '#1ac2c4', '#c4c734', '#4c150a', '#912eb3', '#2a5252', '#524b00', '#bf7d7c', '#24005e',
  '#20f2ba', '#b5882f']

const defaultSliceVisibilityThreshold = 0.01

export const createSingleLineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const {
    xaxisType,
    xaxisTickAmount,
    xaxisLabels,
    title,
    seriesTitle,
    xaxisTitle,
    yaxisTitle,
    stroke,
    fill,
    tooltip
  } = resultClassConfig
  const apexChartOptionsWithData = {
    chart: {
      type: 'line',
      width: '100%',
      height: '100%',
      fontFamily: 'Roboto'
    },
    series: [
      {
        name: seriesTitle,
        data: results.seriesData
      }
    ],
    title: {
      text: title
    },
    xaxis: {
      ...(xaxisType) && { type: xaxisType }, // default is 'category'
      ...(xaxisTickAmount) && { tickAmount: xaxisTickAmount },
      ...(xaxisLabels) && { labels: xaxisLabels },
      categories: results.categoriesData,
      title: {
        text: xaxisTitle
      }
    },
    yaxis: {
      title: {
        text: yaxisTitle
      }
    },
    ...(stroke) && { stroke },
    ...(fill) && { fill },
    ...(tooltip) && { tooltip }
  }
  return apexChartOptionsWithData
}

export const createMultipleLineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const {
    xaxisType,
    xaxisTickAmount,
    xaxisLabels,
    title,
    xaxisTitle,
    yaxisTitle,
    stroke,
    fill,
    tooltip
  } = resultClassConfig
  const series = []
  for (const lineID in results) {
    series.push({
      name: intl.get(`lineChart.${lineID}`),
      data: results[lineID]
    })
  }
  const apexChartOptionsWithData = {
    chart: {
      type: 'area',
      width: '100%',
      height: '100%',
      fontFamily: 'Roboto'
    },
    series: series,
    title: {
      text: title
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      ...(xaxisType) && { type: xaxisType }, // default is 'category'
      ...(xaxisTickAmount) && { tickAmount: xaxisTickAmount },
      ...(xaxisLabels) && { labels: xaxisLabels },
      title: {
        text: xaxisTitle
      }
    },
    yaxis: {
      title: {
        text: yaxisTitle
      }
    },
    ...(stroke) && { stroke },
    ...(fill) && { fill },
    ...(tooltip) && { tooltip }
  }
  return apexChartOptionsWithData
}

export const createApexPieChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const labels = []
  const series = []
  let otherCount = 0
  const arraySum = results.reduce((sum, current) => sum + current.instanceCount, 0)
  const { sliceVisibilityThreshold = defaultSliceVisibilityThreshold, propertyID } = resultClassConfig
  results.forEach(item => {
    const sliceFraction = item.instanceCount / arraySum
    if (sliceFraction <= sliceVisibilityThreshold) {
      otherCount += item.instanceCount
    } else {
      if (item.id === 'http://ldf.fi/MISSING_VALUE' || item.category === 'http://ldf.fi/MISSING_VALUE') {
        item.prefLabel = generateLabelForMissingValue({ perspective: facetClass, property: propertyID })
      }
      labels.push(item.prefLabel)
      series.push(item.instanceCount)
    }
  })
  if (otherCount !== 0) {
    labels.push(intl.get('apexCharts.other') || 'Other')
    series.push(otherCount)
  }
  let chartColors = []
  if (series.length > pieChartColors.length) {
    const quotient = Math.ceil(series.length / pieChartColors.length)
    for (let i = 0; i < quotient; i++) {
      chartColors = chartColors.concat(pieChartColors)
    }
  } else {
    chartColors = pieChartColors
  }
  chartColors = chartColors.slice(0, series.length)
  if (screenSize === 'xs' || screenSize === 'sm') {
    apexPieChartOptions.legend = {
      ...apexPieChartOptions.legend,
      position: 'bottom',
      width: '100%',
      fontSize: 12,
      horizontalAlign: 'left'
    }
    apexPieChartOptions.dataLabels = { enabled: false }
  }
  const apexChartOptionsWithData = {
    ...apexPieChartOptions,
    colors: chartColors,
    series,
    labels
  }
  return apexChartOptionsWithData
}

const apexPieChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'pie',
    width: '100%',
    height: '100%',
    parentHeightOffset: 10,
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
      const { series } = opts.w.globals
      const value = series[opts.seriesIndex]
      const arrSum = series.reduce((a, b) => a + b, 0)
      const percentage = value / arrSum * 100
      return `${seriesName}: ${value} (${percentage.toFixed(2)} %)`
    }
  },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const arrSum = series.reduce((a, b) => a + b, 0)
      const value = series[seriesIndex]
      const percentage = value / arrSum * 100
      return `
                <div class="apexcharts-custom-tooltip">
                  <span>${w.config.labels[seriesIndex]}: ${value} (${percentage.toFixed(2)} %)</span> 
                </div>  
      
            `
    }
  }
}

export const createApexBarChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  chartTypeObj,
  resultClassConfig,
  screenSize
}) => {
  const {
    title,
    seriesTitle,
    xaxisTitle,
    yaxisTitle
  } = resultClassConfig
  const categories = []
  const colors = []
  const data = []
  let otherCount = 0
  const arraySum = results.reduce((sum, current) => sum + current.instanceCount, 0)
  const { sliceVisibilityThreshold = defaultSliceVisibilityThreshold, propertyID } = resultClassConfig
  if (chartTypeObj && chartTypeObj.sortByLocaleCompare) {
    const prop = chartTypeObj.sortByLocaleCompare
    results.sort((a, b) => a[prop].localeCompare(b[prop]))
  }
  results.forEach(item => {
    const sliceFraction = item.instanceCount / arraySum
    if (sliceFraction <= sliceVisibilityThreshold) {
      otherCount += item.instanceCount
    } else {
      if (item.id === 'http://ldf.fi/MISSING_VALUE' || item.category === 'http://ldf.fi/MISSING_VALUE') {
        item.prefLabel = generateLabelForMissingValue({ perspective: facetClass, property: propertyID })
      }
      categories.push(item.prefLabel)
      colors.push('#000000')
      data.push(item.instanceCount)
    }
  })
  if (otherCount !== 0) {
    categories.push(intl.get('apexCharts.other') || 'Other')
    colors.push('#000000')
    data.push(otherCount)
  }
  const apexChartOptionsWithData = {
    ...apexBarChartOptions,
    series: [{
      data,
      name: seriesTitle
    }],
    title: {
      text: title
    },
    xaxis: {
      categories,
      title: {
        text: xaxisTitle
      }
    },
    yaxis: {
      title: {
        text: yaxisTitle
      }
    },
    dataLabels: {
      offsetY: -20,
      style: {
        fontWeight: 400,
        colors
      }
    }
  }
  return apexChartOptionsWithData
}

const apexBarChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'bar',
    width: '100%',
    height: '100%',
    parentHeightOffset: 10,
    fontFamily: 'Roboto'
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top',
        maxItems: 100,
        hideOverflowingLabels: true,
        orientation: 'horizontal'
      }
    }
  }
}

export const createApexTimelineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize,
  fetchInstanceAnalysis
}) => {
  const {
    xaxisTitle,
    yaxisTitle
  } = resultClassConfig
  let min
  let max
  if (results && results.length > 0) {
    preprocessTimelineData(results)
    min = new Date(results[0].beginDate).getTime()
    max = new Date(results[results.length - 1].endDate).getTime()
  }
  const apexChartOptionsWithData = {
    ...timelineOptions,
    chart: {
      type: 'rangeBar',
      width: '100%',
      height: '100%',
      events: {
        click: (event, chartContext, config) => {
          if (chartContext.w.globals.initialSeries[config.seriesIndex]) {
            const data = chartContext.w.globals.initialSeries[config.seriesIndex].data[config.dataPointIndex]
            fetchInstanceAnalysis({
              resultClass: `${resultClass}Dialog`,
              facetClass,
              period: data.period,
              province: data.id
            })
          }
        },
        beforeResetZoom: (chartContext, opts) => {
          return { xaxis: { min, max } }
        }
      }
    },
    xaxis: {
      ...timelineOptions.xaxis,
      title: {
        text: xaxisTitle
      },
      min,
      max
    },
    yaxis: { title: { text: yaxisTitle } },
    series: results
  }
  return apexChartOptionsWithData
}

const timelineOptions = {
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%'
      // rangeBarGroupRows: true
    }
  },
  colors: [
    '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
    '#3F51B5', '#546E7A', '#D4526E', '#8D5B4C', '#F86624',
    '#D7263D', '#1B998B', '#2E294E', '#F46036', '#E2C044'
  ],
  fill: {
    type: 'solid'
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: value => {
        return new Date(value).getFullYear()
      }
    }
  },
  legend: {
    position: 'top'
  },
  tooltip: {
    custom: opts => {
      const data = opts.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex]
      const { ylabel, seriesName } = opts.ctx.rangeBar.getTooltipValues(opts)
      // const startYear = new Date(opts.y1).getFullYear()
      // const endYear = new Date(opts.y2).getFullYear()
      return `
      <div class="apexcharts-custom-tooltip">
        <p><b>Maakunta:</b> ${ylabel.replace(':', '')}</p>
        <p><b>Aikakausi:</b> ${seriesName.replace(':', '')}</p>
        <p><b>Löytöjen lukumäärä:</b> ${data.instanceCount}</p> 
      </div>  
    `
    }
    // fixed: {
    //   enabled: true,
    //   position: 'topLeft',
    //   offsetX: 0,
    //   offsetY: 0
    // }
  },
  grid: {
    borderColor: '#000',
    // row: {
    //   opacity: 0
    // },
    padding: {
      right: 15
    }
  }
}

const preprocessTimelineData = rawData => {
  const lengths = []
  rawData.sort((a, b) => new Date(a.beginDate) - new Date(b.beginDate) || new Date(a.endDate) - new Date(b.endDate))
  rawData.forEach((obj, index) => {
    if (!Array.isArray(obj.data)) { obj.data = [obj.data] }
    obj.data.forEach(dataObj => {
      dataObj.y = [
        new Date(obj.beginDate).getTime(),
        new Date(obj.endDate).getTime()
      ]
    })
    obj.data.sort((a, b) => a.x.localeCompare(b.x))
    lengths.push({ index, length: obj.data.length })
  })
  lengths.sort((a, b) => b.length - a.length)
  if (rawData[0].data.length < lengths[0].length) {
    const indexOfLongestArr = lengths[0].index
    /*
    * The first data array must hold all possible values,
    * because it is used for sortable y-axis.
    */
    rawData[indexOfLongestArr].data.forEach((obj, index) => {
      if (!rawData[0].data.find(x => x.id === obj.id)) {
        rawData[0].data.push({
          id: obj.id,
          x: obj.x,
          y: [null, null],
          instanceCount: 0
        })
      }
    })
  }
  rawData[0].data.sort((a, b) => a.x.localeCompare(b.x))
}
