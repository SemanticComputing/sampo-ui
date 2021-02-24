import React from 'react'
import intl from 'react-intl-universal'
import Deck, { DeckComponent } from './Deck'
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../../configs/sampo/GeneralConfig'
import 'mapbox-gl/dist/mapbox-gl.css'
import { results } from './Deck.testData'

export default {
  component: DeckComponent,
  title: 'Sampo-UI/facet_results/Deck'
}

export const arcLayer = () =>
  <div style={{ width: '100%', height: '100%' }}>
    {/* <Deck
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
    /> */}
    <Deck
      results={results}
      facetUpdateID={0}
      // instanceAnalysisData={props.placesResults.instanceAnalysisData}
      // instanceAnalysisDataUpdateID={props.placesResults.instanceAnalysisDataUpdateID}
      resultClass='placesMsMigrations'
      facetClass='perspective1'
      fetchResults={() => null}
      // fetchInstanceAnalysis={props.fetchInstanceAnalysis}
      fetching={false}
      fetchingInstanceAnalysisData={false}
      layerType='arcLayer'
      getArcWidth={d => d.instanceCountScaled}
      fromText={intl.get('deckGlMap.manuscriptMigrations.from')}
      toText={intl.get('deckGlMap.manuscriptMigrations.to')}
      countText={intl.get('deckGlMap.manuscriptMigrations.count')}
      legendTitle={intl.get('deckGlMap.manuscriptMigrations.legendTitle')}
      legendFromText={intl.get('deckGlMap.manuscriptMigrations.legendFrom')}
      legendToText={intl.get('deckGlMap.manuscriptMigrations.legendTo')}
      showMoreText={intl.get('deckGlMap.showMoreInformation')}
      listHeadingSingleInstance={intl.get('deckGlMap.manuscriptMigrations.listHeadingSingleInstance')}
      listHeadingMultipleInstances={intl.get('deckGlMap.manuscriptMigrations.listHeadingMultipleInstances')}
      instanceVariable='manuscript'
      showTooltips
      mapBoxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapBoxStyle={MAPBOX_STYLE}
    />}

  </div>
