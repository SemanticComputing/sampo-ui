import React from 'react'
import PerspectiveTabs, { PerspectiveTabsComponent } from './PerspectiveTabs'
import { perspectiveConfig } from '../../configs/sampo/PerspectiveConfig'
import { useLocation } from 'react-router-dom'

export default {
  component: PerspectiveTabsComponent,
  title: 'Sampo-UI/main_layout/PerspectiveTabs'
}

export const basic = () => {
  const perspective = perspectiveConfig[0]
  const location = useLocation()
  const routeProps = { location }
  return (
    <PerspectiveTabs
      routeProps={routeProps}
      tabs={perspective.tabs}
      screenSize='md'
    />
  )
}
