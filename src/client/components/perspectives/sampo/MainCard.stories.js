import React from 'react'
import MainCard from './MainCard'
import Center from '../../../../../.storybook/Center'
const { default: perspectiveConfig } = await import('../../../configs/sampo/PerspectiveConfig.json')

export default {
  component: MainCard,
  title: 'Sampo-UI/main_layout/MainCard',
  decorators: [storyFn => <Center>{storyFn()}</Center>]
}

export const basic = () => {
  const perspective = perspectiveConfig[0]
  return (
    <div style={{ width: 404, height: 228 }}>
      <MainCard
        key={perspective.id}
        perspective={perspective}
        cardHeadingVariant='h5'
        rootUrl=''
      />
    </div>
  )
}
