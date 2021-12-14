import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../main_layout/PerspectiveTabs'
import { has } from 'lodash'
const ResultTable = lazy(() => import('./ResultTable'))
const LeafletMap = lazy(() => import('./LeafletMap'))
const Deck = lazy(() => import('./Deck'))
const ApexCharts = lazy(() => import('./ApexCharts'))
const Network = lazy(() => import('./Network'))
// const BarChartRace = lazy(() => import('../../facet_results/BarChartRace'))
const Export = lazy(() => import('./Export'))

const FacetResults = props => {
  const {
    rootUrl, perspective, perspectiveState, facetState, screenSize, portalConfig,
    layoutConfig
  } = props
  const { searchMode } = perspective
  const perspectiveID = perspective.id
  const { maps } = perspectiveState
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

  const createRouteForResultClass = resultClass => {
    let resultClassConfig = perspective.resultClasses[resultClass]
    if (has(resultClassConfig, 'paginatedResultsConfig')) {
      resultClassConfig = resultClassConfig.paginatedResultsConfig
    }
    if (!has(resultClassConfig, 'component')) {
      return null
    }
    const { component, tabPath } = resultClassConfig
    const path = [`${rootUrl}/${perspectiveID}/${searchMode}/${tabPath}`, '/iframe.html']
    const facetClass = resultClassConfig.facetClass ? resultClassConfig.facetClass : resultClass
    let routeComponent
    switch (component) {
      case 'ResultTable':
        routeComponent = (
          <Route
            path={path}
            key={resultClass}
            render={routeProps =>
              <ResultTable
                portalConfig={portalConfig}
                perspectiveConfig={perspective}
                data={perspectiveState}
                facetUpdateID={facetState.facetUpdateID}
                resultClass={resultClass}
                facetClass={facetClass}
                fetchPaginatedResults={props.fetchPaginatedResults}
                updatePage={props.updatePage}
                updateRowsPerPage={props.updateRowsPerPage}
                sortResults={props.sortResults}
                routeProps={routeProps}
                rootUrl={rootUrl}
                layoutConfig={layoutConfig}
              />}
          />
        )
        break
      case 'LeafletMap': {
        const { facetID = null, mapMode = 'cluster', pageType = 'facetResults', customMapControl = false } = resultClassConfig
        const resultClassMap = maps[resultClass]
        routeComponent = (
          <Route
            path={path}
            key={resultClass}
            render={() =>
              <LeafletMap
                portalConfig={portalConfig}
                perspectiveConfig={perspective}
                center={resultClassMap.center}
                zoom={resultClassMap.zoom}
                results={perspectiveState.results}
                leafletMapState={props.leafletMapState}
                pageType={pageType}
                facetUpdateID={facetState.facetUpdateID}
                facet={facetState.facets[facetID]}
                facetID={facetID}
                resultClass={resultClass}
                facetClass={facetClass}
                mapMode={mapMode}
                instance={perspectiveState.instanceTableData}
                createPopUpContent={props.leafletConfig.createPopUpContentMMM}
                popupMaxHeight={popupMaxHeight}
                popupMinWidth={popupMinWidth}
                popupMaxWidth={popupMaxWidth}
                fetchResults={props.fetchResults}
                fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                clearGeoJSONLayers={props.clearGeoJSONLayers}
                fetchByURI={props.fetchByURI}
                fetching={perspectiveState.fetching}
                showInstanceCountInClusters
                updateFacetOption={props.updateFacetOption}
                updateMapBounds={props.updateMapBounds}
                showError={props.showError}
                showExternalLayers
                layerControlExpanded={layerControlExpanded}
                customMapControl={customMapControl}
                layerConfigs={props.leafletConfig.layerConfigs}
                infoHeaderExpanded={perspectiveState.facetedSearchHeaderExpanded}
                layoutConfig={props.layoutConfig}
              />}
          />
        )
        break
      }
      case 'Deck': {
        const { layerType, showTooltips = false } = resultClassConfig
        const { instanceAnalysisData, instanceAnalysisDataUpdateID } = perspectiveState
        const resultClassMap = maps[resultClass]
        let deckProps = {
          portalConfig,
          perspectiveConfig: perspective,
          center: resultClassMap.center,
          zoom: resultClassMap.zoom,
          results: perspectiveState.results,
          facetUpdateID: facetState.facetUpdateID,
          resultClass,
          facetClass,
          fetchResults: props.fetchResults,
          fetching: perspectiveState.fetching,
          fetchInstanceAnalysis: props.fetchInstanceAnalysis,
          fetchingInstanceAnalysisData: perspectiveState.fetchingInstanceAnalysisData,
          layerType,
          updateMapBounds: props.updateMapBounds,
          showTooltips,
          layoutConfig: props.layoutConfig
        }
        if (instanceAnalysisData) {
          deckProps = {
            ...deckProps,
            instanceAnalysisData,
            instanceAnalysisDataUpdateID
          }
        }
        if (layerType === 'arcLayer') {
          const { arcWidthVariable, instanceVariable } = resultClassConfig
          deckProps = {
            ...deckProps,
            getArcWidth: d => d[arcWidthVariable],
            fromText: intl.get(`deckGlMap.${resultClass}.from`),
            toText: intl.get(`deckGlMap.${resultClass}.to`),
            countText: intl.get(`deckGlMap.${resultClass}.count`),
            legendTitle: intl.get(`deckGlMap.${resultClass}.legendTitle`),
            legendFromText: intl.get(`deckGlMap.${resultClass}.legendFrom`),
            legendToText: intl.get(`deckGlMap.${resultClass}.legendTo`),
            showMoreText: intl.get('deckGlMap.showMoreInformation'),
            listHeadingSingleInstance: intl.get(`deckGlMap.${resultClass}.listHeadingSingleInstance`),
            listHeadingMultipleInstances: intl.get(`deckGlMap.${resultClass}.listHeadingMultipleInstances`),
            instanceVariable
          }
        }
        routeComponent = (
          <Route
            path={path}
            key={resultClass}
            render={() => <Deck {...deckProps} />}
          />
        )
        break
      }
      case 'ApexCharts': {
        const {
          pageType = 'facetResults',
          title,
          xAxisTitle,
          xaxisType,
          xaxisTickAmount,
          yaxisTitle,
          seriesTitle,
          stroke,
          fill,
          createChartData
        } = resultClassConfig
        const apexProps = {
          portalConfig,
          perspectiveConfig: perspective,
          pageType,
          resultClass,
          facetClass,
          rawData: perspectiveState.results,
          rawDataUpdateID: perspectiveState.resultUpdateID,
          facetUpdateID: facetState.facetUpdateID,
          fetching: perspectiveState.fetching,
          fetchData: props.fetchResults,
          createChartData: props.apexChartsConfig[createChartData],
          title,
          xAxisTitle,
          xaxisType,
          xaxisTickAmount,
          yaxisTitle,
          seriesTitle,
          stroke,
          fill,
          layoutConfig: props.layoutConfig
        }
        routeComponent = (
          <Route
            path={path}
            key={resultClass}
            render={() =>
              <ApexCharts {...apexProps} />}
          />
        )
        break
      }
      case 'Network': {
        const { networkConfig } = props
        const {
          pageType = 'facetResults',
          limit,
          optimize,
          style,
          layout,
          preprocess
        } = resultClassConfig
        const networkProps = {
          portalConfig,
          perspectiveConfig: perspective,
          pageType,
          resultClass,
          facetClass,
          results: perspectiveState.results,
          resultUpdateID: perspectiveState.resultUpdateID,
          facetUpdateID: facetState.facetUpdateID,
          fetching: perspectiveState.fetching,
          fetchResults: props.fetchResults,
          layoutConfig: props.layoutConfig,
          limit,
          optimize,
          style: networkConfig[style],
          layout: networkConfig[layout],
          preprocess: networkConfig[preprocess]
        }
        routeComponent = (
          <Route
            path={path}
            key={resultClass}
            render={() =>
              <Network {...networkProps} />}
          />
        )
        break
      }
      case 'Export': {
        const exportResultClass = resultClassConfig.resultClass
        routeComponent = (
          <Route
            path={path}
            key={resultClass}
            render={routeProps =>
              <Export
                portalConfig={portalConfig}
                data={perspectiveState}
                resultClass={exportResultClass}
                facetClass={facetClass}
                pageType='facetResults'
                fetchPaginatedResults={props.fetchPaginatedResults}
                updatePage={props.updatePage}
                layoutConfig={props.layoutConfig}
              />}
          />
        )
        break
      }
    }
    return routeComponent
  }

  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={perspective.tabs}
        screenSize={props.screenSize}
        layoutConfig={props.layoutConfig}
      />
      <Route
        exact path={`${rootUrl}/${perspective.id}/faceted-search`}
        render={() => <Redirect to={`${rootUrl}/${perspective.id}/faceted-search/table`} />}
      />
      {Object.keys(perspective.resultClasses).map(resultClass => createRouteForResultClass(resultClass))}
      {/*
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/choropleth_map`}
        render={() =>
          <Deck
            portalConfig={portalConfig}
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
            layoutConfig={props.layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/bar_chart_race_ms_productions`}
        render={() =>
          <BarChartRace
            portalConfig={portalConfig}
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
            portalConfig={portalConfig}
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
       */}
    </>
  )
}

FacetResults.propTypes = {
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

export default FacetResults
