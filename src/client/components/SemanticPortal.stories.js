import React from 'react'
import SemanticPortal, { SemanticPortalComponent } from '../containers/SemanticPortal'
// import { useSelector } from 'react-redux'
// import { useLocation } from 'react-router-dom'

export default {
  component: SemanticPortalComponent,
  title: 'Sampo-UI/SemanticPortal'
}

export const basic = () => {
  // const perspective1 = useSelector(state => state.perspective1)
  // const perspective1Facets = useSelector(state => state.perspective1Facets)
  // const places = useSelector(state => state.places)
  // const leafletMap = useSelector(state => state.leafletMap)
  // const animation = useSelector(state => animation)
  // const location = useLocation()
  // const screenSize = 'lg'
  // const rootUrlWithLang = ''
  // const routeProps = { location }
  return (
    <SemanticPortal />
  )
}
