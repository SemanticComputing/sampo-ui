import React from 'react'
import { useSelector } from 'react-redux'
import InstanceHomePageTable, { InstanceHomePageTableComponent } from './InstanceHomePageTable'
import { data } from './InstanceHomePage.testData.js'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: InstanceHomePageTableComponent,
  title: 'Sampo-UI/main_layout/InstanceHomePageTable',
  decorators: [storyFn => <PaperContainer>{storyFn()}</PaperContainer>]
}

export const basic = () => {
  const facetResults = useSelector(state => state.perspective1)
  return (
    <InstanceHomePageTable
      resultClass='perspective1'
      data={data}
      properties={facetResults.properties}
    />
  )
}
