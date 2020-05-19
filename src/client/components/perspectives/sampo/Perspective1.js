import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import LeafletMap from '../../facet_results/LeafletMap'
import Deck from '../../facet_results/Deck'
import Export from '../../facet_results/Export'
import MigrationsMapLegend from './MigrationsMapLegend'
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../../../configs/sampo/GeneralConfig'

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
            // center={[60.17, 24.81]}
            // zoom={14}
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
            instance={props.placesResults.instance}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.placesResults.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            showExternalLayers
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
            legendComponent={<MigrationsMapLegend />}
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
            instance={props.placesResults.instance}
            fetchResults={props.fetchResults}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            fetchByURI={props.fetchByURI}
            fetching={props.placesResults.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
            showExternalLayers
            showError={props.showError}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/migrations`}
        render={() =>
          <Deck
            results={props.placesResults.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='placesMsMigrations'
            facetClass='perspective1'
            fetchResults={props.fetchResults}
            fetching={props.placesResults.fetching}
            legendComponent={<MigrationsMapLegend />}
            layerType='arcLayer'
            mapBoxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapBoxStyle={MAPBOX_STYLE}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/faceted-search/export`}
        render={() =>
          <Export
            sparqlQuery={props.facetResults.paginatedResultsSparqlQuery}
            pageType='facetResults'
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
  fetchResults: PropTypes.func.isRequired,
  clearGeoJSONLayers: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func.isRequired,
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
