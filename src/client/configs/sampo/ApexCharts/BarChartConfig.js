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
  rawData.map(item => {
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
