import React from 'react'
import PerspectiveTabs, { PerspectiveTabsComponent } from './PerspectiveTabs'
import { perspectiveConfig } from '../../configs/sampo/PerspectiveConfig'

export default {
  component: PerspectiveTabsComponent,
  title: 'Sampo-UI/main_layout/PerspectiveTabs'
}

export const basic = () => {
  const perspective = perspectiveConfig[0]
  return (
    <PerspectiveTabs
      tabs={perspective.tabs}
      screenSize='md'
    />
  )
}
