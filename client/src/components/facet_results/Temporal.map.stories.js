import React from 'react'
import TemporalMap, { TemporalMapComponent } from './TemporalMap'
import { useSelector } from 'react-redux'

export default {
  component: TemporalMapComponent,
  title: 'Sampo-UI/facet_results/TemporalMap'
}

export const basic = () => {
  const facetResults = useSelector(state => state.places)
  const animation = useSelector(state => state.animation)

  return (
    <TemporalMap
      results={facetResults.results}
      resultClass='battlePlacesAnimation'
      facetClass='battles'
      fetchResults={() => null}
      fetching={facetResults.fetching}
      animationValue={animation.value}
      animateMap={() => null}
      facetUpdateID={0}
    />
  )
}
