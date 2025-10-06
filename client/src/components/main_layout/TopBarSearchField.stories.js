import React from 'react'
import TopBarSearchField, { TopBarSearchFieldComponent } from './TopBarSearchField'
import Center from '../../../../.storybook/Center'

export default {
  component: TopBarSearchFieldComponent,
  title: 'Sampo-UI/main_layout/TopBarSearchField',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}

export const basic = () => {
  return (
    <TopBarSearchField
      xsScreen={false}
      rootUrl=''
    />
  )
}

export const extraSmall = () => {
  return (
    <TopBarSearchField
      xsScreen
      rootUrl=''
    />
  )
}
