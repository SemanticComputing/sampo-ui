import React from 'react'
import FacetInfo, { FacetInfoComponent } from './FacetInfo'
import { useSelector } from 'react-redux'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: FacetInfoComponent,
  title: 'Sampo-UI/facet_bar/FacetInfo',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = props => {
  const facetData = useSelector(state => state.perspective1Facets)
  const facetResults = useSelector(state => state.perspective1)

  return (
    <div style={{ width: 500 }}>
      <FacetInfo
        facetedSearchMode='serverFS'
        facetUpdateID={facetData.facetUpdateID}
        facetData={facetData}
        facetClass='perspective1'
        resultClass='perspective1'
        resultCount={facetResults.resultCount}
        fetchResultCount={() => null}
        fetchingResultCount={false}
        someFacetIsFetching={false}
        perspectiveID='perspective1'
      />
    </div>
  )
}
