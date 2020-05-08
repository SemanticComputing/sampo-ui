import React from 'react'
import Center from '../../../../.storybook/Center'
import ExportCSV, { ExportCSVComponent } from './ExportCSV'
import { useSelector } from 'react-redux'

export default {
  component: ExportCSVComponent,
  title: 'Sampo-UI/facet_results/ExportCSV',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}

export const basic = () => {
  const perspective1Facets = useSelector(state => state.perspective1Facets.facets)
  return (
    <ExportCSV
      resultClass='perspective1'
      facetClass='perspective1'
      facetUpdateID={0}
      facets={perspective1Facets}
    />
  )
}
