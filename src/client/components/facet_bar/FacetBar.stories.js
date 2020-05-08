import React from 'react'
import FacetBar, { FacetBarComponent } from './FacetBar'
import { useSelector } from 'react-redux'
import { perspectiveConfig } from '../../configs/sampo/PerspectiveConfig'

export default {
  component: FacetBarComponent,
  title: 'Sampo-UI/facet_bar/FacetBar'
}

export const basic = props => {
  const perspective = perspectiveConfig[0]
  const facetResults = useSelector(state => state.perspective1)
  const perspective1Facets = useSelector(state => state.perspective1Facets)
  const perspective1FacetsConstrainSelf = useSelector(state => state.perspective1FacetsConstrainSelf)
  return (
    <div style={{ width: 500 }}>
      <FacetBar
        facetedSearchMode='serverFS'
        facetData={perspective1Facets}
        facetDataConstrainSelf={perspective1FacetsConstrainSelf}
        facetClass={perspective.id}
        resultClass={perspective.id}
        fetchingResultCount={facetResults.fetchingResultCount}
        resultCount={facetResults.resultCount}
        fetchFacet={() => null}
        fetchFacetConstrainSelf={() => null}
        fetchResultCount={() => null}
        updateFacetOption={() => null}
        defaultActiveFacets={perspective.defaultActiveFacets}
        rootUrl=''
      />
    </div>
  )
}
