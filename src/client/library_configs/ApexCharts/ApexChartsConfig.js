
import intl from 'react-intl-universal'
import { generateLabelForMissingValue } from '../../helpers/helpers'

export const createSingleLineChartData = ({
  rawData,
  title,
  xaxisTitle,
  xaxisType,
  xaxisTickAmount,
  xaxisLabels,
  yaxisTitle,
  seriesTitle,
  stroke,
  fill,
  tooltip
}) => {
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
        data: rawData.seriesData
      }
    ],
    title: {
      text: title
    },
    xaxis: {
      ...(xaxisType) && { type: xaxisType }, // default is 'category'
      ...(xaxisTickAmount) && { tickAmount: xaxisTickAmount },
      ...(xaxisLabels) && { labels: xaxisLabels },
      categories: rawData.categoriesData,
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
  rawData,
  title,
  xaxisTitle,
  xaxisType,
  xaxisTickAmount,
  xaxisLabels,
  yaxisTitle,
  seriesTitle,
  stroke,
  fill,
  tooltip
}) => {
  const series = []
  for (const lineID in rawData) {
    series.push({
      name: intl.get(`lineChart.${lineID}`),
      data: rawData[lineID]
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

export const createApexPieChartData = ({ rawData, screenSize, facetClass, facetID }) => {
  const labels = []
  const series = []
  let otherCount = 0
  const totalLength = rawData.length
  const threshold = 0.15
  rawData.forEach(item => {
    const portion = parseInt(item.instanceCount) / totalLength
    if (portion < threshold) {
      otherCount += parseInt(item.instanceCount)
    } else {
      if (item.id === 'http://ldf.fi/MISSING_VALUE') {
        item.prefLabel = generateLabelForMissingValue({ facetClass, facetID })
      }
      labels.push(item.prefLabel)
      series.push(parseInt(item.instanceCount))
    }
  })
  if (otherCount !== 0) {
    labels.push('Other')
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

// list of colors generated with http://phrogz.net/css/distinct-colors.html
const pieChartColors = ['#a12a3c', '#0f00b5', '#81c7a4', '#ffdea6', '#ff0033', '#424cff', '#1b6935', '#ff9d00', '#5c3c43',
  '#5f74b8', '#18b532', '#3b3226', '#fa216d', '#153ca1', '#00ff09', '#703a00', '#b31772', '#a4c9fc', '#273623',
  '#f57200', '#360e2c', '#001c3d', '#ccffa6', '#a18068', '#ba79b6', '#004e75', '#547500', '#c2774c', '#f321fa', '#1793b3',
  '#929c65', '#b53218', '#563c5c', '#1ac2c4', '#c4c734', '#4c150a', '#912eb3', '#2a5252', '#524b00', '#bf7d7c', '#24005e',
  '#20f2ba', '#b5882f']

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
  rawData,
  title,
  xaxisTitle,
  yaxisTitle,
  seriesTitle
}) => {
  const categories = []
  const colors = []
  const data = []
  let otherCount = 0
  const totalLength = rawData.length
  const threshold = 0.3
  rawData.forEach(item => {
    const portion = parseInt(item.instanceCount) / totalLength
    if (portion < threshold) {
      otherCount += parseInt(item.instanceCount)
    } else {
      categories.push(item.prefLabel)
      colors.push('#000000')
      data.push(parseInt(item.instanceCount))
    }
  })
  if (otherCount !== 0) {
    categories.push('Other')
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
