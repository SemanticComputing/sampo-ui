import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import InstanceHomePage, { InstanceHomePageComponent } from './InstanceHomePage'
import { perspectiveConfig } from '../../configs/sampo/PerspectiveConfig'
import { data, sparqlQuery } from './InstanceHomePage.testData.js'

export default {
  component: InstanceHomePageComponent,
  title: 'Sampo-UI/main_layout/InstanceHomePage'
}

export const basic = () => {
  const perspective = perspectiveConfig[0]
  const facetResults = useSelector(state => state.perspective1)
  const location = useLocation()
  const routeProps = { location }
  return (
    <InstanceHomePage
      rootUrl=''
      fetchByURI={() => null}
      resultClass={perspective.id}
      properties={facetResults.properties}
      tabs={perspective.instancePageTabs}
      data={data}
      sparqlQuery={sparqlQuery}
      isLoading={false}
      routeProps={routeProps}
      screenSize='md'
    />
  )
}
