import React from 'react'
import FacetHeader, { FacetHeaderComponent } from './FacetHeader'
import Paper from '@material-ui/core/Paper'
import { useSelector } from 'react-redux'
import intl from 'react-intl-universal'
import Center from '../../../../.storybook/Center'

export default {
  component: FacetHeaderComponent,
  title: 'Sampo-UI/facet_bar/FacetHeader',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}

export const basic = props => {
  const facetID = 'language'
  const label = intl.get(`perspectives.perspective1.properties.${facetID}.label`)
  const description = intl.get(`perspectives.perspective1.properties.${facetID}.description`)
  const facet = useSelector(state => state.perspective1Facets.facets[facetID])
  const facetConstrainSelf = useSelector(state => state.perspective1FacetsConstrainSelf.facets[facetID])
  return (
    <Paper style={{ width: 500, paddingLeft: 8 }}>
      <FacetHeader
        facetID={facetID}
        facetLabel={label}
        facet={facet}
        facetConstrainSelf={facetConstrainSelf}
        isActive
        facetClass='perspective1'
        resultClass='perspective1'
        fetchFacet={() => null}
        fetchFacetConstrainSelf={() => null}
        updateFacetOption={() => null}
        facetDescription={description}
        rootUrl=''
      />
    </Paper>
  )
}
