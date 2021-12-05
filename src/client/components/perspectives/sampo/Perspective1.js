import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
const ResultTable = lazy(() => import('../../facet_results/ResultTable'))
const LeafletMap = lazy(() => import('../../facet_results/LeafletMap'))
const Deck = lazy(() => import('../../facet_results/Deck'))
const ApexChart = lazy(() => import('../../facet_results/ApexChart'))
const BarChartRace = lazy(() => import('../../facet_results/BarChartRace'))
const Network = lazy(() => import('../../facet_results/Network'))
const Export = lazy(() => import('../../facet_results/Export'))

const Perspective1 = props => {
  const { rootUrl, perspective, screenSize } = props
  const layerControlExpanded = screenSize === 'md' ||
    screenSize === 'lg' ||
    screenSize === 'xl'
  let popupMaxHeight = 320
  let popupMinWidth = 280
  let popupMaxWidth = 280
  if (screenSize === 'xs' || screenSize === 'sm') {
    popupMaxHeight = 200
    popupMinWidth = 150
    popupMaxWidth = 150
  }
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
        screenSize={props.screenSize}
        layoutConfig={props.layoutConfig}
      />
      <Route
        exact path={`${rootUrl}/${perspective.id}/faceted-search`}
        render={() => <Redirect to={`${rootUrl}/${perspective.id}/faceted-search/table`} />}
      />
      <Route
        path={[`${props.rootUrl}/${perspective.id}/faceted-search/table`, '/iframe.html']}
        render={routeProps =>
          <ResultTable
            data={props.perspectiveState}
            facetUpdateID={props.facetState.facetUpdateID}
            resultClass='perspective1'
            facetClass='perspective1'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
            rootUrl={rootUrl}
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/production_places`}
        render={() =>
          <LeafletMap
            mapBoxAccessToken={props.mapBoxAccessToken}
            mapBoxStyle={props.mapBoxStyle}
            center={props.perspectiveState.maps.placesMsProduced.center}
            zoom={props.perspectiveState.maps.placesMsProduced.zoom}
            // center={[60.187, 24.821]}
            // zoom={13}
            // locateUser
            results={props.perspectiveState.results}
            leafletMapState={props.leafletMapState}
            pageType='facetResults'
            facetUpdateID={props.facetState.facetUpdateID}
            facet={props.facetState.facets.productionPlace}
            facetID='productionPlace'
            resultClass='placesMsProduced'
            facetClass='perspective1'
            mapMode='cluster'
            instance={props.perspectiveState.instanceTableData}
            createPopUpContent={props.leafletConfig.createPopUpContentMMM}
            popupMaxHeight={popupMaxHeight}
            popupMinWidth={popupMinWidth}
            popupMaxWidth={popupMaxWidth}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.perspectiveState.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            updateMapBounds={props.updateMapBounds}
            showError={props.showError}
            showExternalLayers
            layerControlExpanded={layerControlExpanded}
            // customMapControl
            layerConfigs={props.leafletConfig.layerConfigs}
            infoHeaderExpanded={props.perspectiveState.facetedSearchHeaderExpanded}
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/production_places_heatmap`}
        render={() =>
          <Deck
            center={props.perspectiveState.maps.placesMsProducedHeatmap.center}
            zoom={props.perspectiveState.maps.placesMsProducedHeatmap.zoom}
            results={props.perspectiveState.results}
            facetUpdateID={props.facetState.facetUpdateID}
            resultClass='placesMsProducedHeatmap'
            facetClass='perspective1'
            fetchResults={props.fetchResults}
            fetching={props.perspectiveState.fetching}
            layerType='heatmapLayer'
            mapBoxAccessToken={props.mapBoxAccessToken}
            mapBoxStyle={props.mapBoxStyle}
            updateMapBounds={props.updateMapBounds}
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/last_known_locations`}
        render={() =>
          <LeafletMap
            mapBoxAccessToken={props.mapBoxAccessToken}
            mapBoxStyle={props.mapBoxStyle}
            center={props.perspectiveState.maps.lastKnownLocations.center}
            zoom={props.perspectiveState.maps.lastKnownLocations.zoom}
            results={props.perspectiveState.results}
            leafletMapState={props.leafletMapState}
            pageType='facetResults'
            facetUpdateID={props.facetState.facetUpdateID}
            facet={props.facetState.facets.lastKnownLocation}
            facetID='lastKnownLocation'
            resultClass='lastKnownLocations'
            facetClass='perspective1'
            mapMode='cluster'
            showMapModeControl={false}
            instance={props.perspectiveState.instanceTableData}
            createPopUpContent={props.leafletConfig.createPopUpContentMMM}
            popupMaxHeight={popupMaxHeight}
            popupMinWidth={popupMinWidth}
            popupMaxWidth={popupMaxWidth}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.perspectiveState.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            updateMapBounds={props.updateMapBounds}
            showError={props.showError}
            showExternalLayers
            layerControlExpanded={layerControlExpanded}
            layerConfigs={props.leafletConfig.layerConfigs}
            infoHeaderExpanded={props.perspectiveState.facetedSearchHeaderExpanded}
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/migrations`}
        render={() =>
          <Deck
            center={props.perspectiveState.maps.placesMsMigrations.center}
            zoom={props.perspectiveState.maps.placesMsMigrations.zoom}
            results={props.perspectiveState.results}
            facetUpdateID={props.facetState.facetUpdateID}
            instanceAnalysisData={props.perspectiveState.instanceAnalysisData}
            instanceAnalysisDataUpdateID={props.perspectiveState.instanceAnalysisDataUpdateID}
            resultClass='placesMsMigrations'
            facetClass='perspective1'
            fetchResults={props.fetchResults}
            fetchInstanceAnalysis={props.fetchInstanceAnalysis}
            fetching={props.perspectiveState.fetching}
            fetchingInstanceAnalysisData={props.perspectiveState.fetchingInstanceAnalysisData}
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
            mapBoxAccessToken={props.mapBoxAccessToken}
            mapBoxStyle={props.mapBoxStyle}
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/choropleth_map`}
        render={() =>
          <Deck
            center={props.perspectiveState.maps.casualtiesByMunicipality.center}
            zoom={props.perspectiveState.maps.casualtiesByMunicipality.zoom}
            results={props.perspectiveState.results}
            facetUpdateID={props.facetState.facetUpdateID}
            instanceAnalysisData={props.perspectiveState.instanceAnalysisData}
            instanceAnalysisDataUpdateID={props.perspectiveState.instanceAnalysisDataUpdateID}
            resultClass='casualtiesByMunicipality'
            facetClass='perspective1'
            fetchResults={props.fetchResults}
            fetchInstanceAnalysis={props.fetchInstanceAnalysis}
            fetching={props.perspectiveState.fetching}
            fetchingInstanceAnalysisData={props.perspectiveState.fetchingInstanceAnalysisData}
            layerType='polygonLayer'
            mapBoxAccessToken={props.mapBoxAccessToken}
            mapBoxStyle={props.mapBoxStyle}
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/production_dates`}
        render={() =>
          <ApexChart
            pageType='facetResults'
            rawData={props.perspectiveState.results}
            rawDataUpdateID={props.perspectiveState.resultUpdateID}
            facetUpdateID={props.facetState.facetUpdateID}
            fetching={props.perspectiveState.fetching}
            fetchData={props.fetchResults}
            createChartData={props.lineChartConfig.createSingleLineChartData}
            title='Manuscript production by decade'
            xaxisTitle='Decade'
            xaxisType='category'
            xaxisTickAmount={30}
            yaxisTitle='Manuscript count'
            seriesTitle='Manuscript count'
            stroke={{ width: 2 }}
            resultClass='productionTimespanLineChart'
            facetClass='perspective1'
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/event_dates`}
        render={() =>
          <ApexChart
            pageType='facetResults'
            rawData={props.perspectiveState.results}
            rawDataUpdateID={props.perspectiveState.resultUpdateID}
            facetUpdateID={props.facetState.facetUpdateID}
            fetching={props.perspectiveState.fetching}
            fetchData={props.fetchResults}
            createChartData={props.lineChartConfig.createMultipleLineChartData}
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
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/bar_chart_race_ms_productions`}
        render={() =>
          <BarChartRace
            fetchData={props.fetchResults}
            resultClass='productionsByDecadeAndCountry'
            facetClass='perspective1'
            resultUpdateID={props.perspectiveState.resultUpdateID}
            results={props.perspectiveState.results}
            stepBegin={1000}
            stepEnd={1900}
            stepIncrement={10}
            stepDuration={1000}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/bar_chart_race_speeches`}
        render={() =>
          <BarChartRace
            fetchData={props.fetchResults}
            resultClass='speechesByYearAndParty'
            facetClass='perspective1'
            resultUpdateID={props.perspectiveState.resultUpdateID}
            results={props.perspectiveState.results}
            stepBegin={1907}
            stepEnd={2021}
            stepIncrement={1}
            stepDuration={1000}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/network`}
        render={() =>
          <Network
            results={props.perspectiveState.results}
            facetUpdateID={props.facetState.facetUpdateID}
            resultUpdateID={props.perspectiveState.resultUpdateID}
            fetchResults={props.fetchResults}
            fetching={props.perspectiveState.fetching}
            resultClass='manuscriptFacetResultsNetwork'
            facetClass='perspective1'
            limit={500}
            optimize={1.2}
            style={props.networkConfig.cytoscapeStyle}
            layout={props.networkConfig.coseLayout}
            preprocess={props.networkConfig.preprocess}
            pageType='facetResults'
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/export`}
        render={() =>
          <Export
            data={props.perspectiveState}
            resultClass='perspective1'
            facetClass='perspective1'
            pageType='facetResults'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            layoutConfig={props.layoutConfig}
          />}
      />
    </>
  )
}

Perspective1.propTypes = {
  /**
   * Faceted search configs and results of this perspective.
   */
  perspectiveState: PropTypes.object.isRequired,
  /**
   * Faceted search configs and results of places related to this perspective.
   */
  facetState: PropTypes.object.isRequired,
  /**
   * Facet values where facets constrain themselves, used for statistics.
   */
  facetConstrainSelfState: PropTypes.object,
  /**
   * Leaflet map config and external layers.
   */
  leafletMapState: PropTypes.object,
  /**
   * Redux action for fetching paginated results.
   */
  fetchPaginatedResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching all results.
   */
  fetchResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching facet values for statistics.
   */
  fetchFacetConstrainSelf: PropTypes.func,
  /**
   * Redux action for loading external GeoJSON layers.
   */
  fetchGeoJSONLayers: PropTypes.func,
  /**
   * Redux action for loading external GeoJSON layers via backend.
   */
  fetchGeoJSONLayersBackend: PropTypes.func,
  /**
   * Redux action for clearing external GeoJSON layers.
   */
  clearGeoJSONLayers: PropTypes.func,
  /**
   * Redux action for fetching information about a single entity.
   */
  fetchByURI: PropTypes.func.isRequired,
  /**
   * Redux action for updating the page of paginated results.
   */
  updatePage: PropTypes.func.isRequired,
  /**
   * Redux action for updating the rows per page of paginated results.
   */
  updateRowsPerPage: PropTypes.func.isRequired,
  /**
   * Redux action for sorting the paginated results.
   */
  sortResults: PropTypes.func.isRequired,
  /**
   * Redux action for updating the active selection or config of a facet.
   */
  showError: PropTypes.func.isRequired,
  /**
   * Redux action for showing an error
   */
  updateFacetOption: PropTypes.func.isRequired,
  /**
   * Routing information from React Router.
   */
  routeProps: PropTypes.object.isRequired,
  /**
   * Perspective config.
   */
  perspective: PropTypes.object.isRequired,
  /**
   * State of the animation, used by TemporalMap.
   */
  animationValue: PropTypes.array,
  /**
   * Redux action for animating TemporalMap.
   */
  animateMap: PropTypes.func,
  /**
   * Current screen size.
   */
  screenSize: PropTypes.string.isRequired,
  /**
   * Root url of the application.
   */
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default Perspective1
