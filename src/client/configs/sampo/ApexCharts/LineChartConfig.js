export const createApexLineChartData = rawData => {
  const apexChartOptionsWithData = {
    ...apexLineChartOptions,
    series: [
      {
        name: 'Series 1',
        data: [45, 52, 38, 45, 19, 33]
      }
    ],
    xaxis: {
      categories: [
        '01 Jan',
        '02 Jan',
        '03 Jan',
        '04 Jan',
        '05 Jan',
        '06 Jan'
      ]
    }
  }
  return apexChartOptionsWithData
}

const apexLineChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'line',
    width: 500,
    height: 500,
    parentHeightOffset: 10,
    fontFamily: 'Roboto'
  }
}
