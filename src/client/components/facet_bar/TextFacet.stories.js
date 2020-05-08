import React from 'react'
import TextFacet, { TextFacetComponent } from './TextFacet'
import { useSelector } from 'react-redux'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: TextFacetComponent,
  title: 'Sampo-UI/facet_bar/TextFacet',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = props => {
  const facetID = 'prefLabel'
  const facet = useSelector(state => state.perspective1Facets.facets[facetID])
  return (
    <div style={{ width: 400 }}>
      <TextFacet
        facetID={facetID}
        facet={facet}
        facetClass='perspective1'
        resultClass='perspective1'
        facetUpdateID={0}
        fetchFacet={() => null}
        someFacetIsFetching={false}
        updateFacetOption={() => null}
      />
    </div>
  )
}

export const loading = props => {
  const facetID = 'prefLabel'
  const facet = useSelector(state => state.perspective1Facets.facets[facetID])
  return (
    <div style={{ width: 400 }}>
      <TextFacet
        facetID={facetID}
        facet={facet}
        facetClass='perspective1'
        resultClass='perspective1'
        facetUpdateID={0}
        fetchFacet={() => null}
        someFacetIsFetching
        updateFacetOption={() => null}
      />
    </div>
  )
}
