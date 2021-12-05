import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
const ResultTable = lazy(() => import('../../facet_results/ResultTable'))
const LeafletMap = lazy(() => import('../../facet_results/LeafletMap'))
const Export = lazy(() => import('../../facet_results/Export'))

const Perspective3 = props => {
  const { rootUrl, perspective, screenSize } = props
  const layerControlExpanded = screenSize === 'md' ||
    screenSize === 'lg' ||
    screenSize === 'xl'
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
        path={`${props.rootUrl}/${perspective.id}/faceted-search/table`}
        render={routeProps =>
          <ResultTable
            data={props.perspectiveState}
            facetUpdateID={props.facetState.facetUpdateID}
            resultClass='perspective3'
            facetClass='perspective3'
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
        path={`${rootUrl}/${perspective.id}/faceted-search/map`}
        render={() =>
          <LeafletMap
            mapBoxAccessToken={props.mapBoxAccessToken}
            mapBoxStyle={props.mapBoxStyle}
            center={props.perspectiveState.maps.placesEvents.center}
            zoom={props.perspectiveState.maps.placesEvents.zoom}
            results={props.perspectiveState.results}
            leafletMapState={props.leafletMapState}
            pageType='facetResults'
            facetUpdateID={props.facetState.facetUpdateID}
            facet={props.facetState.facets.place}
            facetID='place'
            resultClass='placesEvents'
            facetClass='perspective3'
            mapMode='cluster'
            instance={props.perspectiveState.instanceTableData}
            createPopUpContent={props.leafletConfig.createPopUpContentMMM}
            popupMaxHeight={320}
            popupMinWidth={280}
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
        path={`${rootUrl}/${perspective.id}/faceted-search/export`}
        render={() =>
          <Export
            data={props.perspectiveState}
            resultClass='perspective3'
            facetClass='perspective3'
            pageType='facetResults'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            layoutConfig={props.layoutConfig}
            yasguiBaseUrl={props.yasguiBaseUrl}
            yasguiParams={props.yasguiParams}
          />}
      />
    </>
  )
}

Perspective3.propTypes = {
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
  facetConstrainSelfState: PropTypes.object.isRequired,
  /**
     * Leaflet map config and external layers.
     */
  leafletMapState: PropTypes.object.isRequired,
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
  fetchFacetConstrainSelf: PropTypes.func.isRequired,
  /**
     * Redux action for loading external GeoJSON layers.
     */
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  /**
     * Redux action for loading external GeoJSON layers via backend.
     */
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  /**
     * Redux action for clearing external GeoJSON layers.
     */
  clearGeoJSONLayers: PropTypes.func.isRequired,
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
  animationValue: PropTypes.array.isRequired,
  /**
     * Redux action for animating TemporalMap.
     */
  animateMap: PropTypes.func.isRequired,
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

export default Perspective3
