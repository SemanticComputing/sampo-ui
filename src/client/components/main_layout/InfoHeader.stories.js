import React from 'react'
import InfoHeader, { InfoHeaderComponent } from './InfoHeader'
import { perspectiveConfig } from '../../configs/sampo/PerspectiveConfig'

export default {
  component: InfoHeaderComponent,
  title: 'Sampo-UI/main_layout/InfoHeader'
}

export const collapsed = props => {
  const perspective = perspectiveConfig[0]
  return (
    <InfoHeader
      resultClass={perspective.id}
      pageType='facetResults'
      expanded={false}
      updateExpanded={() => null}
      descriptionHeight={perspective.perspectiveDescHeight}
    />
  )
}

export const expanded = props => {
  const perspective = perspectiveConfig[0]
  return (
    <InfoHeader
      resultClass={perspective.id}
      pageType='facetResults'
      expanded
      updateExpanded={() => null}
      descriptionHeight={perspective.perspectiveDescHeight}
    />
  )
}
