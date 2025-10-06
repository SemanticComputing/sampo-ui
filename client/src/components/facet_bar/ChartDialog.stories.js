import React from 'react'
import ChartDialog from './ChartDialog'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'
import { productionPlace } from './HierarchicalFacet.testData'

export default {
  component: ChartDialog,
  title: 'Sampo-UI/facet_bar/ChartDialog',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}
export const basic = props => {
  return (
    <div style={{ width: 400 }}>
      <ChartDialog
        data={productionPlace.flatValues}
        fetching={false}
        facetID='productionPlace'
        facetClass='perspective1'
        fetchFacetConstrainSelf={() => null}
      />
    </div>
  )
}
