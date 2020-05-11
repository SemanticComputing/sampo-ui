import React from 'react'
import FacetedSearchPerspective from './FacetedSearchPerspective'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { perspectiveConfig } from '../../../configs/sampo/PerspectiveConfig'

export default {
  component: FacetedSearchPerspective,
  title: 'Sampo-UI/perspectives/sampo/FacetedSearchPerspective'
}

export const basic = () => {
  const perspective = perspectiveConfig[0]
  const perspective1 = useSelector(state => state.perspective1)
  const perspective1Facets = useSelector(state => state.perspective1Facets)
  const places = useSelector(state => state.places)
  const leafletMap = useSelector(state => state.leafletMap)
  const animation = useSelector(state => animation)
  const location = useLocation()
  const screenSize = 'lg'
  const rootUrlWithLang = ''
  const routeProps = { location }
  return (
    <FacetedSearchPerspective
      facetResults={perspective1}
      placesResults={places}
      facetData={perspective1Facets}
      leafletMap={leafletMap}
      fetchPaginatedResults={() => null}
      fetchResults={() => null}
      fetchGeoJSONLayers={() => null}
      fetchByURI={() => null}
      updatePage={() => null}
      updateRowsPerPage={() => null}
      updateFacetOption={() => null}
      sortResults={() => null}
      routeProps={routeProps}
      perspective={perspective}
      animationValue={animation}
      animateMap={() => null}
      screenSize={screenSize}
      rootUrl={rootUrlWithLang}
    />
  )
}
