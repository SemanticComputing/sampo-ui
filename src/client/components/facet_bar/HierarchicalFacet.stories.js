import React from 'react'
import HierarchicalFacet, { HierarchicalFacetComponent } from './HierarchicalFacet'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'
import { productionPlace } from './HierarchicalFacet.testData'
import 'react-sortable-tree/style.css' // This only needs to be imported once in your app

export default {
  component: HierarchicalFacetComponent,
  title: 'Sampo-UI/facet_bar/HierarchicalFacet',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = props => {
  const facetID = 'productionPlace'
  return (
    <div style={{ width: 400, height: 500, overflow: 'auto' }}>
      {/* <div style={{ height: 400 }}>
        <SortableTree
          treeData={productionPlace.values}
        />
      </div> */}
      <HierarchicalFacet
        facetID={facetID}
        facet={productionPlace}
        facetClass='perspective1'
        someFacetIsFetching={false}
        fetchFacet={() => null}
        facetedSearchMode='storybook'
      />
    </div>
  )
}
