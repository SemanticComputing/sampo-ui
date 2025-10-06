import React from 'react'
import RangeFacet, { RangeFacetComponent } from './RangeFacet'
import { useSelector } from 'react-redux'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: RangeFacetComponent,
  title: 'Sampo-UI/facet_bar/RangeFacet',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = props => {
  const facetID = 'width'
  const facet = useSelector(state => state.perspective1Facets.facets[facetID])
  return (
    <div style={{ width: 400 }}>
      <RangeFacet
        facetID={facetID}
        facet={facet}
        facetClass='perspective1'
        resultClass='perspective1'
        facetUpdateID={0}
        fetchFacet={() => null}
        someFacetIsFetching={false}
        updateFacetOption={() => null}
        dataType='integer'
      />
    </div>
  )
}
