import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import Export from '../../facet_results/Export'
import LeafletMap from '../../facet_results/LeafletMap'
import { layerConfigs, createPopUpContentMMM } from '../../../configs/sampo/Leaflet/LeafletConfig'

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
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/map`}
        render={() =>
          <LeafletMap
            center={[22.43, 10.37]}
            zoom={2}
            results={props.placesState.results}
            layers={props.leafletMapLayers}
            pageType='facetResults'
            facetUpdateID={props.facetState.facetUpdateID}
            facet={props.facetState.facets.place}
            facetID='place'
            resultClass='placesEvents'
            facetClass='perspective3'
            mapMode='cluster'
            instance={props.placesState.instanceTableData}
            createPopUpContent={createPopUpContentMMM}
            popupMaxHeight={320}
            popupMinWidth={280}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.placesState.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            showError={props.showError}
            showExternalLayers
            layerControlExpanded={layerControlExpanded}
            layerConfigs={layerConfigs}
            infoHeaderExpanded={props.perspectiveState.facetedSearchHeaderExpanded}
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
  placesState: PropTypes.object.isRequired,
  /**
     * Facet configs and values.
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
  rootUrl: PropTypes.string.isRequired
}

export default Perspective3
