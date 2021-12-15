import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { has } from 'lodash'
import PerspectiveTabs from '../main_layout/PerspectiveTabs'
import ResultClassRoute from './ResultClassRoute'

const FacetResults = props => {
  const {
    rootUrl, perspective
  } = props
  const { searchMode } = perspective
  const perspectiveID = perspective.id
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
      {Object.keys(perspective.resultClasses).map(resultClass => {
        let resultClassConfig = perspective.resultClasses[resultClass]
        if (has(resultClassConfig, 'paginatedResultsConfig')) {
          resultClassConfig = resultClassConfig.paginatedResultsConfig
        }
        if (!has(resultClassConfig, 'component')) {
          return null
        }
        const { tabPath } = resultClassConfig
        const facetClass = resultClassConfig.facetClass ? resultClassConfig.facetClass : resultClass
        const path = [`${rootUrl}/${perspectiveID}/${searchMode}/${tabPath}`, '/iframe.html']
        return (
          <ResultClassRoute
            key={resultClass}
            path={path}
            resultClass={resultClass}
            facetClass={facetClass}
            resultClassConfig={resultClassConfig}
            {...props}
          />
        )
      })}
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
