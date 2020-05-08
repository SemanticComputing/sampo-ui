import React from 'react'
import Deck, { DeckComponent } from './Deck'
import MigrationsMapLegend from '../perspectives/sampo/MigrationsMapLegend'
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../../configs/sampo/GeneralConfig'
import 'mapbox-gl/dist/mapbox-gl.css'
import { results } from './Deck.testData'

export default {
  component: DeckComponent,
  title: 'Sampo-UI/facet_results/Deck'
}

export const arcLayer = () =>
  <div style={{ width: '100%', height: '100%' }}>
    <Deck
      results={results}
      facetUpdateID={0}
      resultClass='placesMsMigrations'
      facetClass='perspective1'
      fetchResults={() => null}
      fetching={false}
      legendComponent={<MigrationsMapLegend />}
      layerType='arcLayer'
      mapBoxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapBoxStyle={MAPBOX_STYLE}
    />
  </div>
