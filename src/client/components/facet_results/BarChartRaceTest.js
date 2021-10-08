
import React from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'
import Paper from '@material-ui/core/Paper'

/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// const allData = {
//   1410: {
//     Ukraine: 8000,
//     Israel: 6000,
//     Eritrea: 5000,
//     Sweden: 12000,
//     Spain: 0
//   }
// 1420: {
//   Iraq: 6,
//   Spain: 572,
//   Greece: 66
// },
// 1430: {
//   Montenegro: 3,
//   India: 8,
//   Slovenia: 2
// }
// }

// Data
const allData = {
  2002: {
    Friendster: 0,
    Facebook: 0,
    Flickr: 0,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 0,
    Instagram: 0,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 0
  },
  2003: {
    Friendster: 4470000,
    Facebook: 0,
    Flickr: 0,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 0,
    Instagram: 0,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 0
  },
  2004: {
    Friendster: 5970054,
    Facebook: 0,
    Flickr: 3675135,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 0,
    Instagram: 0,
    MySpace: 980036,
    Orkut: 4900180,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 0
  },
  2005: {
    Friendster: 7459742,
    Facebook: 0,
    Flickr: 7399354,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 9731610,
    Instagram: 0,
    MySpace: 19490059,
    Orkut: 9865805,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 1946322
  },
  2006: {
    Friendster: 8989854,
    Facebook: 0,
    Flickr: 14949270,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 19932360,
    Instagram: 0,
    MySpace: 54763260,
    Orkut: 14966180,
    Pinterest: 0,
    Reddit: 248309,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 19878248
  },
  2007: {
    Friendster: 24253200,
    Facebook: 0,
    Flickr: 29299875,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 29533250,
    Instagram: 0,
    MySpace: 69299875,
    Orkut: 26916562,
    Pinterest: 0,
    Reddit: 488331,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 143932250
  },
  2008: {
    Friendster: 51008911,
    Facebook: 100000000,
    Flickr: 30000000,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 55045618,
    Instagram: 0,
    MySpace: 72408233,
    Orkut: 44357628,
    Pinterest: 0,
    Reddit: 1944940,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 294493950
  },
  2009: {
    Friendster: 28804331,
    Facebook: 276000000,
    Flickr: 41834525,
    'Google Buzz': 0,
    'Google+': 0,
    Hi5: 57893524,
    Instagram: 0,
    MySpace: 70133095,
    Orkut: 47366905,
    Pinterest: 0,
    Reddit: 3893524,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 0,
    WeChat: 0,
    Weibo: 0,
    Whatsapp: 0,
    YouTube: 413611440
  },
  2010: {
    Friendster: 0,
    Facebook: 517750000,
    Flickr: 54708063,
    'Google Buzz': 166029650,
    'Google+': 0,
    Hi5: 59953290,
    Instagram: 0,
    MySpace: 68046710,
    Orkut: 49941613,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 43250000,
    WeChat: 0,
    Weibo: 19532900,
    Whatsapp: 0,
    YouTube: 480551990
  },
  2011: {
    Friendster: 0,
    Facebook: 766000000,
    Flickr: 66954600,
    'Google Buzz': 170000000,
    'Google+': 0,
    Hi5: 46610848,
    Instagram: 0,
    MySpace: 46003536,
    Orkut: 47609080,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 0,
    Twitter: 92750000,
    WeChat: 47818400,
    Weibo: 48691040,
    Whatsapp: 0,
    YouTube: 642669824
  },
  2012: {
    Friendster: 0,
    Facebook: 979750000,
    Flickr: 79664888,
    'Google Buzz': 170000000,
    'Google+': 107319100,
    Hi5: 0,
    Instagram: 0,
    MySpace: 0,
    Orkut: 45067022,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 146890156,
    Twitter: 160250000,
    WeChat: 118123370,
    Weibo: 79195730,
    Whatsapp: 0,
    YouTube: 844638200
  },
  2013: {
    Friendster: 0,
    Facebook: 1170500000,
    Flickr: 80000000,
    'Google Buzz': 170000000,
    'Google+': 205654700,
    Hi5: 0,
    Instagram: 117500000,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 0,
    Reddit: 0,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 293482050,
    Twitter: 223675000,
    WeChat: 196523760,
    Weibo: 118261880,
    Whatsapp: 300000000,
    YouTube: 1065223075
  },
  2014: {
    Friendster: 0,
    Facebook: 1334000000,
    Flickr: 0,
    'Google Buzz': 170000000,
    'Google+': 254859015,
    Hi5: 0,
    Instagram: 250000000,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 0,
    Reddit: 135786956,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 388721163,
    Twitter: 223675000,
    WeChat: 444232415,
    Weibo: 154890345,
    Whatsapp: 498750000,
    YouTube: 1249451725
  },
  2015: {
    Friendster: 0,
    Facebook: 1516750000,
    Flickr: 0,
    'Google Buzz': 170000000,
    'Google+': 298950015,
    Hi5: 0,
    Instagram: 400000000,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 0,
    Reddit: 163346676,
    Snapchat: 0,
    TikTok: 0,
    Tumblr: 475923363,
    Twitter: 304500000,
    WeChat: 660843407,
    Weibo: 208716685,
    Whatsapp: 800000000,
    YouTube: 1328133360
  },
  2016: {
    Friendster: 0,
    Facebook: 1753500000,
    Flickr: 0,
    'Google Buzz': 0,
    'Google+': 398648000,
    Hi5: 0,
    Instagram: 550000000,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 143250000,
    Reddit: 238972480,
    Snapchat: 238648000,
    TikTok: 0,
    Tumblr: 565796720,
    Twitter: 314500000,
    WeChat: 847512320,
    Weibo: 281026560,
    Whatsapp: 1000000000,
    YouTube: 1399053600
  },
  2017: {
    Friendster: 0,
    Facebook: 2035750000,
    Flickr: 0,
    'Google Buzz': 0,
    'Google+': 495657000,
    Hi5: 0,
    Instagram: 750000000,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 195000000,
    Reddit: 297394200,
    Snapchat: 0,
    TikTok: 239142500,
    Tumblr: 593783960,
    Twitter: 328250000,
    WeChat: 921742750,
    Weibo: 357569030,
    Whatsapp: 1333333333,
    YouTube: 1495657000
  },
  2018: {
    Friendster: 0,
    Facebook: 2255250000,
    Flickr: 0,
    'Google Buzz': 0,
    'Google+': 430000000,
    Hi5: 0,
    Instagram: 1000000000,
    MySpace: 0,
    Orkut: 0,
    Pinterest: 246500000,
    Reddit: 355000000,
    Snapchat: 0,
    TikTok: 500000000,
    Tumblr: 624000000,
    Twitter: 329500000,
    WeChat: 1000000000,
    Weibo: 431000000,
    Whatsapp: 1433333333,
    YouTube: 1900000000
  }
}

const stepDuration = 2000

let year = 2002
// let year = 1410

class BarChartRace extends React.Component {
    componentDidMount = () => {
      this.props.fetchData({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass
      })
      this.initChart()
    }

    componentDidUpdate = prevProps => {
      if (prevProps.resultUpdateID !== this.props.resultUpdateID) {
        // console.log(this.props.results)
        this.setInitialData()
        this.sortCategoryAxis()
        this.updateData()
        // this.playAnimation()
      }
    }

    componentWillUnmount () {
      if (this.chart) {
        this.chart.dispose()
      }
    }

    initChart = () => {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      const root = am5.Root.new('chartdiv')

      root.numberFormatter.setAll({
        numberFormat: '#a',

        // Group only into M (millions), and B (billions)
        bigNumberPrefixes: [
          { number: 1e6, suffix: 'M' },
          { number: 1e9, suffix: 'B' }
        ],

        // Do not use small number prefixes at all
        smallNumberPrefixes: []
      })

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([am5themesAnimated.new(root)])

      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      const chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'none',
        wheelY: 'none'
      }))

      // We don't want zoom-out button to appear while animating, so we hide it at all
      chart.zoomOutButton.set('forceHidden', true)

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      const yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 20,
        inversed: true
      })

      // hide grid
      yRenderer.grid.template.set('visible', false)
      // yRenderer.labels.template.setAll({
      //   fontSize: '0.3rem'
      // })

      this.yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: 'category',
        renderer: yRenderer
      }))

      const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        strictMinMax: true,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {})
      }))

      xAxis.set('interpolationDuration', stepDuration / 10)
      xAxis.set('interpolationEasing', am5.ease.linear)

      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      this.series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: this.yAxis,
        valueXField: 'value',
        categoryYField: 'category'
      }))

      // Rounded corners for columns
      this.series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 })

      // Make each column to be of a different color
      this.series.columns.template.adapters.add('fill', (fill, target) => {
        return chart.get('colors').getIndex(this.series.columns.indexOf(target))
      })

      this.series.columns.template.adapters.add('stroke', (stroke, target) => {
        return chart.get('colors').getIndex(this.series.columns.indexOf(target))
      })

      // Add label bullet
      this.series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 1,
          sprite: am5.Label.new(root, {
            text: "{valueXWorking.formatNumber('#.# a')}",
            fill: root.interfaceColors.get('alternativeText'),
            centerX: am5.p100,
            centerY: am5.p50,
            populateText: true
          })
        })
      })

      this.label = chart.plotContainer.children.push(am5.Label.new(root, {
        text: '2002',
        fontSize: '8em',
        opacity: 0.2,
        x: am5.p100,
        y: am5.p100,
        centerY: am5.p100,
        centerX: am5.p100
      }))

      this.chart = chart
    }

    setInitialData = () => {
      const d = allData[year]
      // const d = this.props.results[year]
      // console.log(d)

      for (const n in d) {
        this.series.data.push({ category: n, value: d[n] })
        this.yAxis.data.push({ category: n })
      }

      // this.series.appear(1000)
      // this.chart.appear(1000, 100)
    }

    updateData = () => {
      let itemsWithNonZero = 0
      if (allData[year]) {
      // if (this.props.results[year]) {
        this.label.set('text', year.toString())

        am5.array.each(this.series.dataItems, dataItem => {
          console.log(dataItem)
          const category = dataItem.get('categoryY')
          const value = allData[year][category]
          // const value = this.props.results[year][category]
          // console.log(this.props.results[year].France)

          // console.log(value)

          if (value > 0) {
            itemsWithNonZero++
          }

          dataItem.animate({
            key: 'valueX',
            to: value,
            duration: stepDuration,
            easing: am5.ease.linear
          })
          dataItem.animate({
            key: 'valueXWorking',
            to: value,
            duration: stepDuration,
            easing: am5.ease.linear
          })
        })

        this.yAxis.zoom(0, itemsWithNonZero / this.yAxis.dataItems.length)
      }
    }

    playAnimation = () => {
      // update data with values each 1.5 sec
      const interval = setInterval(() => {
        year++
        // year += 10

        if (year > 2018) {
          clearInterval(interval)
          clearInterval(this.sortInterval)
        }

        this.updateData()
      }, stepDuration)

      this.setInitialData()
      setTimeout(() => {
        year++
        // year += 10
        this.updateData()
      }, 50)

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      this.series.appear(1000)
      this.chart.appear(1000, 100)
    }

    // Get series item by category
    getSeriesItem = category => {
      for (let i = 0; i < this.series.dataItems.length; i++) {
        const dataItem = this.series.dataItems[i]
        if (dataItem.get('categoryY') === category) {
          return dataItem
        }
      }
    }

    sortInterval = setInterval(() => {
      this.sortCategoryAxis()
    }, 100)

    // Axis sorting
    sortCategoryAxis = () => {
      // sort by value
      this.series.dataItems.sort(function (x, y) {
        return y.get('valueX') - x.get('valueX') // descending
        // return x.get("valueX") - y.get("valueX"); // ascending
      })

      // go through each axis item
      am5.array.each(this.yAxis.dataItems, dataItem => {
        // get corresponding series item
        const seriesDataItem = this.getSeriesItem(dataItem.get('category'))

        if (seriesDataItem) {
          // get index of series data item
          const index = this.series.dataItems.indexOf(seriesDataItem)
          // calculate delta position
          const deltaPosition =
                (index - dataItem.get('index', 0)) / this.series.dataItems.length
          // set index to be the same as series data item index
          if (dataItem.get('index') !== index) {
            dataItem.set('index', index)
            // set deltaPosition instanlty
            dataItem.set('deltaPosition', -deltaPosition)
            // animate delta position to 0
            dataItem.animate({
              key: 'deltaPosition',
              to: 0,
              duration: stepDuration / 2,
              easing: am5.ease.out(am5.ease.cubic)
            })
          }
        }
      })
      // sort axis items by index.
      // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
      this.yAxis.dataItems.sort(function (x, y) {
        return x.get('index') - y.get('index')
      })
    }

    render () {
      return (
        <Paper square style={{ width: '100%', height: 'calc(100% - 72px)' }}>
          <div style={{ width: '100%', height: '100%' }} id='chartdiv' />
        </Paper>

      )
    }
}

export default BarChartRace
