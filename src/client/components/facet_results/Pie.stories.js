import React from 'react'
import Pie, { PieComponent } from './Pie'
import { useSelector } from 'react-redux'
import Center from '../../../../.storybook/Center'
import { results } from './VirtualizedTable.stories'

export default {
  component: PieComponent,
  title: 'Sampo-UI/facet_results/Pie',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}

export const basic = () => {
  const clientSideFacetedSearch = useSelector(state => state.clientSideFacetedSearch)
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Pie
        data={results}
        groupBy={clientSideFacetedSearch.groupBy}
        groupByLabel={clientSideFacetedSearch.groupByLabel}
        query={clientSideFacetedSearch.query}
      />
    </div>
  )
}
