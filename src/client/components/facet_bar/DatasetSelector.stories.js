import React from 'react'
import { useSelector } from 'react-redux'
import DatasetSelector, { DatasetSelectorComponent } from './DatasetSelector'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: DatasetSelectorComponent,
  title: 'Sampo-UI/facet_bar/DatasetSelector',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = props => {
  const datasets = useSelector(state => state.clientSideFacetedSearch.datasets)
  return (
    <div style={{ width: 550, height: 200, overflow: 'auto' }}>
      <DatasetSelector
        datasets={datasets}
        clientFSToggleDataset={() => null}
        perspectiveID='clientFSPlaces'
      />
    </div>
  )
}
