import React from 'react'
import SearchField, { SearchFieldComponent } from './SearchField'
import Center from '../../../../.storybook/Center'
import { useSelector } from 'react-redux'

export default {
  component: SearchFieldComponent,
  title: 'Sampo-UI/facet_bar/SearchField',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}
export const basic = () => {
  const clientSideFacetedSearch = useSelector(state => state.clientSideFacetedSearch)
  return (
    <div style={{ width: 400 }}>
      <SearchField
        search={clientSideFacetedSearch}
        fetchResults={() => null}
        clearResults={() => null}
        updateQuery={() => null}
        datasets={clientSideFacetedSearch.datasets}
        perspectiveID='clientFSPlaces'
      />
    </div>
  )
}
