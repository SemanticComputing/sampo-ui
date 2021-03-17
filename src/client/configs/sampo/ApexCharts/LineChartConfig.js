
import intl from 'react-intl-universal'

export const createSingleLineChartData = ({
  rawData,
  title,
  xaxisTitle,
  xaxisType,
  xaxisTickAmount,
  xaxisLabels,
  yaxisTitle,
  seriesTitle
}) => {
  const apexChartOptionsWithData = {
    ...singleLineChartOptions,
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
    }
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
  seriesTitle
}) => {
  const series = []
  for (const lineID in rawData) {
    series.push({
      name: intl.get(`lineChart.${lineID}`),
      data: rawData[lineID]
    })
  }
  const apexChartOptionsWithData = {
    ...multipleLineChartOptions,
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
    stroke: {
      curve: 'straight',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [20, 60, 100, 100]
      }
    }
  }
  return apexChartOptionsWithData
}

const singleLineChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'line',
    width: '100%',
    height: '100%',
    fontFamily: 'Roboto'
  }
}

const multipleLineChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'area',
    width: '100%',
    height: '100%',
    fontFamily: 'Roboto'
  }
}
