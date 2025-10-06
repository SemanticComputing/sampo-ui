import React from 'react'
import LeafletMap, { LeafletMapComponent } from './LeafletMap'
import { useSelector } from 'react-redux'

export default {
  component: LeafletMapComponent,
  title: 'Sampo-UI/facet_results/LeafletMap'
}

export const productionPlaces = () => {
  const placesResults = useSelector(state => state.places)
  const leafletMap = useSelector(state => state.leafletMap)
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LeafletMap
        center={[22.43, 10.37]}
        zoom={2}
        results={placesResults.results}
        layers={leafletMap}
        pageType='facetResults'
        facetUpdateID={0}
        resultClass='placesMsProduced'
        facetClass='perspective1'
        mapMode='cluster'
        fetchResults={() => null}
        showMapModeControl={false}
        instance={placesResults.instance}
        fetching={false}
        showInstanceCountInClusters
        showExternalLayers={false}
      />
    </div>
  )
}
