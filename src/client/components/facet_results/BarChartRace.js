
import React from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'
import Paper from '@mui/material/Paper'

// https://www.amcharts.com/docs/v5/

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
        if (this.props.results && Object.prototype.hasOwnProperty.call(this.props.results, this.props.stepBegin)) {
          this.setInitialData()
          this.playAnimation()
        }
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

      this.yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        extraMax: 0.1,
        categoryField: 'category',
        renderer: yRenderer
      }))

      this.yAxis.get('renderer').labels.template.adapters.add('text', (label, target, key) => {
        if (target.dataItem && target.dataItem.dataContext) {
          return target.dataItem.dataContext.prefLabel
        }
      })

      const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        strictMinMax: true,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {})
      }))

      xAxis.set('interpolationDuration', this.props.stepDuration / 10)
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
            text: "{valueXWorking.formatNumber('#.')}",
            fill: root.interfaceColors.get('alternativeText'),
            centerX: am5.p100,
            centerY: am5.p50,
            populateText: true
          })
        })
      })

      this.animationStep = this.props.stepBegin

      this.label = chart.plotContainer.children.push(am5.Label.new(root, {
        text: this.animationStep,
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
      const step = this.props.results[this.animationStep]
      for (const id in step) {
        const { prefLabel, value } = step[id]
        this.series.data.push({ category: id, value, prefLabel })
        this.yAxis.data.push({ category: id, prefLabel })
      }
      setTimeout(() => {
        this.yAxis.zoomToIndexes(0, this.yAxis.dataItems.length - 1)
      }, 100)
    }

    updateData = () => {
      if (this.props.results[this.animationStep] == null) { return }
      for (const [key, value] of Object.entries(this.props.results[this.animationStep])) {
        const dataItem = this.getSeriesItem(key)
        if (dataItem == null) {
          this.series.data.push({ category: key, value: value.value, prefLabel: value.prefLabel })
          this.yAxis.data.push({ category: key, prefLabel: value.prefLabel })
        }
      }
      this.label.set('text', this.animationStep.toString())
      am5.array.each(this.series.dataItems, dataItem => {
        const category = dataItem.get('categoryY')
        const value = this.props.results[this.animationStep][category].value
        dataItem.animate({
          key: 'valueX',
          to: value,
          duration: this.props.stepDuration,
          easing: am5.ease.linear
        })
        dataItem.animate({
          key: 'valueXWorking',
          to: value,
          duration: this.props.stepDuration,
          easing: am5.ease.linear
        })
      })
      const endIndex = this.yAxis.dataItems.length < 10
        ? this.yAxis.dataItems.length - 1
        : 10
      this.yAxis.zoomToIndexes(0, endIndex)
    }

    playAnimation = () => {
      const sortInterval = setInterval(() => {
        this.sortCategoryAxis()
      }, 100)

      const interval = setInterval(() => {
        this.animationStep += this.props.stepIncrement
        if (this.animationStep > this.props.stepEnd) {
          clearInterval(interval)
          clearInterval(sortInterval)
          // sort category axis one more time
          setTimeout(() => {
            this.sortCategoryAxis()
          }, 2000)
        }
        this.updateData()
      }, this.props.stepDuration)

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      this.series.appear(2000)
      this.chart.appear(2000, 100)
    }

    // Get series item by category
    getSeriesItem = category => {
      for (let i = 0; i < this.series.dataItems.length; i++) {
        const dataItem = this.series.dataItems[i]
        if (dataItem.get('categoryY') === category) {
          return dataItem
        }
      }
      return null
    }

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
        if (seriesDataItem !== null) {
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
              duration: this.props.stepDuration / 2,
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
        <Paper square style={{ width: 'calc(100% - 64px)', height: 'calc(100% - 72px)', paddingLeft: 32, paddingRight: 32 }}>
          <div style={{ width: '100%', height: '100%' }} id='chartdiv' />
        </Paper>
      )
    }
}

export default BarChartRace
