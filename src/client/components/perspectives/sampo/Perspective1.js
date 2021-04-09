import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import LeafletMap from '../../facet_results/LeafletMap'
import Deck from '../../facet_results/Deck'
import ApexChart from '../../facet_results/ApexChart'
import Network from '../../facet_results/Network'
import Export from '../../facet_results/Export'
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../../../configs/sampo/GeneralConfig'
import {
  createSingleLineChartData,
  createMultipleLineChartData
} from '../../../configs/sampo/ApexCharts/LineChartConfig'
import { coseLayout, cytoscapeStyle, preprocess } from '../../../configs/sampo/Cytoscape.js/NetworkConfig'

const Perspective1 = props => {
  const { rootUrl, perspective } = props
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
        screenSize={props.screenSize}
      />
      <Route
        exact path={`${rootUrl}/${perspective.id}/faceted-search`}
        render={() => <Redirect to={`${rootUrl}/${perspective.id}/faceted-search/table`} />}
      />
      <Route
        path={[`${props.rootUrl}/${perspective.id}/faceted-search/table`, '/iframe.html']}
        render={routeProps =>
          <ResultTable
            data={props.facetResults}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='perspective1'
            facetClass='perspective1'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
            rootUrl={rootUrl}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/production_places`}
        render={() =>
          <LeafletMap
            center={[22.43, 10.37]}
            zoom={2}
            // locateUser
            // center={[60.187, 24.821]}
            // zoom={13}
            results={props.placesResults.results}
            layers={props.leafletMapLayers}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.productionPlace}
            facetID='productionPlace'
            resultClass='placesMsProduced'
            facetClass='perspective1'
            mapMode='cluster'
            showMapModeControl={false}
            instance={props.placesResults.instanceTableData}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.placesResults.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            showExternalLayers
            layerConfigs={[
              // {
              //   id: 'arkeologiset_kohteet_alue',
              //   type: 'GeoJSON',
              //   minZoom: 13,
              //   buffer: {
              //     distance: 200,
              //     units: 'metres',
              //     style: feature => {
              //       if (feature.properties.laji.includes('poistettu kiinteä muinaisjäännös')) {
              //         return {
              //           fillOpacity: 0,
              //           weight: 0
              //         }
              //       } else {
              //         return {
              //           color: '#6E6E6E',
              //           dashArray: '3, 5'
              //         }
              //       }
              //     }
              //   },
              //   createGeoJSONPointStyle: feature => null, //  this layer includes only GeoJSON Polygons
              //   createGeoJSONPolygonStyle: feature => {
              //     // console.log(feature)
              //     return {
              //       color: '#dd2c00',
              //       cursor: 'pointer'
              //     }
              //   },
              //   createPopup: data => {
              //     let html = ''
              //     const name = data.kohdenimi
              //       ? `<b>Kohteen nimi:</b> ${data.kohdenimi}</p>` : ''
              //     const type = data.laji ? `<b>Kohteen tyyppi:</b> ${data.laji}</p>` : ''
              //     const municipality = data.kunta ? `<b>Kunta:</b> ${data.kunta}</p>` : ''
              //     const link = data.mjtunnus
              //       ? `<a href="https://www.kyppi.fi/to.aspx?id=112.${data.mjtunnus}" target="_blank">Avaa kohde Muinaisjäännösrekisterissä</a></p>` : ''
              //     html += `
              //     <div>
              //       ${name}
              //       ${type}
              //       ${municipality}
              //       ${link}
              //     </div>
              //     `
              //     return html
              //   }
              // },
              // {
              //   id: 'arkeologiset_kohteet_piste',
              //   type: 'GeoJSON',
              //   minZoom: 13,
              //   buffer: {
              //     distance: 200,
              //     units: 'metres',
              //     style: feature => {
              //       if (feature.properties.laji.includes('poistettu kiinteä muinaisjäännös')) {
              //         return {
              //           fillOpacity: 0,
              //           weight: 0
              //         }
              //       } else {
              //         return {
              //           color: '#6E6E6E',
              //           dashArray: '3, 5'
              //         }
              //       }
              //     }
              //   },
              //   createGeoJSONPointStyle: feature => {
              //     return {
              //       radius: 8,
              //       fillColor: '#dd2c00',
              //       color: '#000',
              //       weight: 1,
              //       opacity: 1,
              //       fillOpacity: 0.8
              //     }
              //   },
              //   createGeoJSONPolygonStyle: feature => null, // this layer includes only GeoJSON points
              //   createPopup: data => {
              //     let html = ''
              //     const name = data.kohdenimi
              //       ? `<b>Kohteen nimi:</b> ${data.kohdenimi}</p>` : ''
              //     const type = data.laji ? `<b>Kohteen tyyppi:</b> ${data.laji}</p>` : ''
              //     const municipality = data.kunta ? `<b>Kunta:</b> ${data.kunta}</p>` : ''
              //     const link = data.mjtunnus
              //       ? `<a href="https://www.kyppi.fi/to.aspx?id=112.${data.mjtunnus}" target="_blank">Avaa kohde Muinaisjäännösrekisterissä</a></p>` : ''
              //     html += `
              //     <div>
              //       ${name}
              //       ${type}
              //       ${municipality}
              //       ${link}
              //     </div>
              //     `
              //     return html
              //   }
              // },
              // {
              //   id: 'fhaLidar',
              //   type: 'WMS',
              //   url: `${process.env.API_URL}/fha-wms`,
              //   layers: 'NBA:lidar',
              //   version: '1.3.0',
              //   attribution: 'FHA',
              //   minZoom: 13,
              //   maxZoom: 16
              // },
              {
                id: 'karelianMaps',
                type: 'WMTS',
                url: 'https:///mapwarper.onki.fi/mosaics/tile/4/{z}/{x}/{y}.png',
                opacityControl: true,
                attribution: 'Semantic Computing Research Group'
              },
              {
                id: 'senateAtlas',
                type: 'WMTS',
                url: 'https:///mapwarper.onki.fi/mosaics/tile/5/{z}/{x}/{y}.png',
                opacityControl: true,
                attribution: 'Semantic Computing Research Group'
              }
            ]}
            // activeLayers={[
            //   'arkeologiset_kohteet_alue',
            //   'arkeologiset_kohteet_piste'
            // ]}
            layerControlExpanded
            showError={props.showError}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/production_places_heatmap`}
        render={() =>
          <Deck
            results={props.placesResults.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='placesMsProduced'
            facetClass='perspective1'
            fetchResults={props.fetchResults}
            fetching={props.placesResults.fetching}
            layerType='heatmapLayer'
            mapBoxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapBoxStyle={MAPBOX_STYLE}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/last_known_locations`}
        render={() =>
          <LeafletMap
            center={[22.43, 10.37]}
            zoom={2}
            results={props.placesResults.results}
            layers={props.leafletMapLayers}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.productionPlace}
            facetID='lastKnownLocation'
            resultClass='lastKnownLocations'
            facetClass='perspective1'
            mapMode='cluster'
            showMapModeControl={false}
            instance={props.placesResults.instanceTableData}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.placesResults.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            showError={props.showError}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/migrations`}
        render={() =>
          <Deck
            results={props.placesResults.results}
            facetUpdateID={props.facetData.facetUpdateID}
            instanceAnalysisData={props.placesResults.instanceAnalysisData}
            instanceAnalysisDataUpdateID={props.placesResults.instanceAnalysisDataUpdateID}
            resultClass='placesMsMigrations'
            facetClass='perspective1'
            fetchResults={props.fetchResults}
            fetchInstanceAnalysis={props.fetchInstanceAnalysis}
            fetching={props.placesResults.fetching}
            fetchingInstanceAnalysisData={props.placesResults.fetchingInstanceAnalysisData}
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
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/production_dates`}
        render={() =>
          <ApexChart
            pageType='facetResults'
            rawData={props.facetResults.results}
            rawDataUpdateID={props.facetResults.resultUpdateID}
            facetUpdateID={props.facetData.facetUpdateID}
            fetching={props.facetResults.fetching}
            fetchData={props.fetchResults}
            createChartData={createSingleLineChartData}
            title='Manuscript production by decade'
            xaxisTitle='Decade'
            xaxisType='category'
            xaxisTickAmount={30}
            yaxisTitle='Manuscript count'
            seriesTitle='Manuscript count'
            stroke={{ width: 2 }}
            resultClass='productionTimespanLineChart'
            facetClass='perspective1'
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/event_dates`}
        render={() =>
          <ApexChart
            pageType='facetResults'
            rawData={props.facetResults.results}
            rawDataUpdateID={props.facetResults.resultUpdateID}
            facetUpdateID={props.facetData.facetUpdateID}
            fetching={props.facetResults.fetching}
            fetchData={props.fetchResults}
            createChartData={createMultipleLineChartData}
            title='Manuscript events by decade'
            xaxisTitle='Year'
            xaxisType='category'
            xaxisTickAmount={30}
            yaxisTitle='Count'
            seriesTitle='Count'
            stroke={{
              curve: 'straight',
              width: 2
            }}
            fill={{
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.6,
                opacityTo: 0.05,
                stops: [20, 60, 100, 100]
              }
            }}
            resultClass='eventLineChart'
            facetClass='perspective1'
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/network`}
        render={() =>
          <Network
            results={props.facetResults.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultUpdateID={props.facetResults.resultUpdateID}
            fetchResults={props.fetchResults}
            fetching={props.facetResults.fetching}
            resultClass='manuscriptFacetResultsNetwork'
            facetClass='perspective1'
            limit={500}
            optimize={1.2}
            style={cytoscapeStyle}
            layout={coseLayout}
            preprocess={preprocess}
            pageType='facetResults'
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/export`}
        render={() =>
          <Export
            data={props.facetResults}
            resultClass='perspective1'
            facetClass='perspective1'
            pageType='facetResults'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
          />}
      />
    </>
  )
}

Perspective1.propTypes = {
  facetResults: PropTypes.object.isRequired,
  placesResults: PropTypes.object.isRequired,
  leafletMapLayers: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  facetDataConstrainSelf: PropTypes.object,
  fetchResults: PropTypes.func.isRequired,
  clearGeoJSONLayers: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  perspective: PropTypes.object.isRequired,
  animationValue: PropTypes.array.isRequired,
  animateMap: PropTypes.func.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  showError: PropTypes.func.isRequired
}

export default Perspective1
