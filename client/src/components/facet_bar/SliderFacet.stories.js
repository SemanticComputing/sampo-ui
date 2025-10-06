import React from 'react'
import SliderFacet, { SliderFacetComponent } from './SliderFacet'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

const facet = {
  id: 'productionTimespan',
  // predicate: defined in backend
  distinctValueCount: 0,
  values: [],
  flatValues: [],
  sortBy: null,
  sortDirection: null,
  sortButton: false,
  spatialFilterButton: false,
  isFetching: false,
  searchField: false,
  containerClass: 'three',
  filterType: 'timespanFilter',
  min: '-0940-01-01',
  max: '2021-12-31',
  timespanFilter: null,
  type: 'timespan',
  priority: 8
}

export default {
  component: SliderFacetComponent,
  title: 'Sampo-UI/facet_bar/SliderFacet',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = props => {
  return (
    <div style={{ width: 600, height: 70 }}>
      <SliderFacet
        facetID='productionTimespan'
        facet={facet}
        facetClass='perspective1'
        resultClass='perspective1'
        facetUpdateID={0}
        fetchFacet={() => null}
        someFacetIsFetching={false}
        updateFacetOption={() => null}
        dataType='ISOString'
      />
    </div>
  )
}
