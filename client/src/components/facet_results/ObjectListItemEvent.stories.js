import React from 'react'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'
import ObjectListItemEvent, { ObjectListItemEventComponent } from './ObjectListItemEvent'

export default {
  component: ObjectListItemEventComponent,
  title: 'Sampo-UI/facet_results/ObjectListItemEvent',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

export const basic = () =>
  <ObjectListItemEvent
    data={{
      id: 'http://ldf.fi/mmm/event/bibale_production_10000',
      type: 'http://erlangen-crm.org/current/E12_Production',
      date: '0701 - 0800',
      prefLabel: 'Production',
      dataProviderUrl: '/events/page/bibale_production_10000'
    }}
  />

export const isFirstValue = () =>
  <ObjectListItemEvent
    data={{
      id: 'http://ldf.fi/mmm/event/bibale_production_10000',
      type: 'http://erlangen-crm.org/current/E12_Production',
      date: '0701 - 0800',
      prefLabel: 'Production',
      dataProviderUrl: '/events/page/bibale_production_10000'
    }}
    isFirstValue
  />
