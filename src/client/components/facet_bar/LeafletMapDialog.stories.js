import React from 'react'
import LeafletMapDialog, { LeafletMapDialogComponent } from './LeafletMapDialog'
import Center from '../../../../.storybook/Center'
import { useSelector } from 'react-redux'

export default {
  component: LeafletMapDialogComponent,
  title: 'Sampo-UI/facet_bar/LeafletMapDialog',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}
export const basic = () => {
  const leafletMap = useSelector(state => state.leafletMap)
  return (
    <div style={{ width: 400 }}>
      <LeafletMapDialog
        map={leafletMap}
        clientFSFetchResults={() => null}
        clientFSClearResults={() => null}
        updateMapBounds={() => null}
        fetching={false}
        showError={() => null}
        perspectiveID='clientFSPlaces'
      />
    </div>
  )
}
