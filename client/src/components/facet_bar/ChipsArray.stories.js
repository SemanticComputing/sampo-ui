import React from 'react'
import ChipsArray, { ChipsArrayComponent } from './ChipsArray'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: ChipsArrayComponent,
  title: 'Sampo-UI/facet_bar/ChipsArray',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

const facetValues = [
  {
    facetID: 'author',
    facetLabel: 'Author',
    filterType: 'uriFilter',
    value: {
      node: {
        id: 'http://ldf.fi/mmm/actor/bodley_person_78769600',
        prefLabel: 'Cicero, Marcus Tullius',
        selected: 'false',
        parent: null,
        instanceCount: '2575'
      },
      parentNode: null,
      path: [3],
      lowerSiblingCounts: [8527],
      treeIndex: 3,
      isSearchMatch: false,
      isSearchFocus: false,
      added: true
    }
  },
  {
    facetID: 'author',
    facetLabel: 'Author',
    filterType: 'uriFilter',
    value: {
      node: {
        id: 'http://ldf.fi/mmm/actor/bodley_person_95147024',
        prefLabel: 'Jerome, Saint, -419 or 420',
        selected: 'false',
        parent: null,
        instanceCount: '3240',
        parentNode: null,
        path: [2],
        lowerSiblingCounts: [8528],
        treeIndex: 2,
        isSearchMatch: false,
        isSearchFocus: false,
        added: true
      }
    }
  },
  {
    facetID: 'productionPlace',
    facetLabel: 'Production place',
    filterType: 'uriFilter',
    value: {
      node: {
        id: 'http://ldf.fi/mmm/place/tgn_7024097',
        prefLabel: 'Flanders',
        selected: 'false',
        parent: 'http://ldf.fi/mmm/place/tgn_1000003',
        instanceCount: '28',
        totalInstanceCount: 28
      },
      parentNode: {
        id: 'http://ldf.fi/mmm/place/tgn_1000003',
        prefLabel: 'Europe',
        selected: 'false',
        parent: 'http://ldf.fi/mmm/place/tgn_7029392',
        instanceCount: '1'
      }
    }
  }
]

export const basic = props => {
  return (
    <div style={{ width: 400 }}>
      <ChipsArray
        data={facetValues}
        facetClass='perspective1'
        updateFacetOption={() => null}
        someFacetIsFetching={false}
        fetchFacet={() => null}
      />
    </div>
  )
}
