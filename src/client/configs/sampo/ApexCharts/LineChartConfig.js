export const createApexLineChartData = ({
  rawData,
  title,
  xaxisTitle,
  yaxisTitle,
  seriesTitle
}) => {
  const apexChartOptionsWithData = {
    ...apexLineChartOptions,
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
      categories: rawData.categoriesData,
      labels: {
        rotate: 0
      },
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

const apexLineChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'line',
    width: '100%',
    height: '100%',
    fontFamily: 'Roboto'
  }
}
