import React from 'react'
import Center from '../../../../.storybook/Center'
import ApexChart, { ApexChartComponent } from './ApexChart'
import { productionPlace } from '../facet_bar/HierarchicalFacet.testData'

export default {
  component: ApexChartComponent,
  title: 'Sampo-UI/facet_results/ApexChart',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}

const sortedData = productionPlace.flatValues.sort((a, b) => {
  const aCount = parseInt(a.instanceCount)
  const bCount = parseInt(b.instanceCount)
  if (aCount > bCount) { return -1 }
  if (bCount > aCount) { return 1 }
  return 0
})

export const basic = () =>
  <ApexChart
    facetID='productionPlace'
    facetClass='perspective1'
    fetchFacetConstrainSelf={() => null}
    data={sortedData}
    fetching={false}
    options={{
      chart: {
        type: 'pie',
        width: '100%',
        height: '100%',
        // parentHeightOffset: 0,
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
          return `${seriesName} [${opts.w.globals.series[opts.seriesIndex]}]`
        }
      },
      tooltip: {
        // enabled: false,
        followCursor: false,
        fixed: {
          enabled: true,
          position: 'topRight'
        }
      }
    }}
  />
