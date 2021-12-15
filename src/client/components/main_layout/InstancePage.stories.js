import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import InstanceHomePage, { InstancePageComponent } from './InstancePage'
import { data, sparqlQuery } from './InstancePage.testData.js'
const { default: perspective } = await import('../../configs/sampo/perspective_configs/search_perspectives/perspective1.json')

export default {
  component: InstancePageComponent,
  title: 'Sampo-UI/main_layout/InstanceHomePage'
}

export const basic = () => {
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
