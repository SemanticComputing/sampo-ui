import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ResultTable from '../../facet_results/ResultTable'
import LeafletMap from '../../facet_results/LeafletMap'
import Deck from '../../facet_results/Deck'
import Network from '../../facet_results/Network'
import Export from '../../facet_results/Export'

const Perspective1 = props => {
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
        screenSize={props.screenSize}
      />
      <Route
        exact path='/perspective1/faceted-search'
        render={() => <Redirect to='/perspective1/faceted-search/table' />}
      />
      <Route
        path='/perspective1/faceted-search/table'
        render={routeProps =>
          <ResultTable
            data={props.perspective1}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='perspective1'
            facetClass='perspective1'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />}
      />
      <Route
        path='/perspective1/faceted-search/production_places'
        render={() =>
          <LeafletMap
            results={props.places.results}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.productionPlace}
            facetID='productionPlace'
            resultClass='placesMsProduced'
            facetClass='perspective1'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path='/perspective1/faceted-search/last_known_locations'
        render={() =>
          <LeafletMap
            results={props.places.results}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.lastKnownLocation}
            facetID='lastKnownLocation'
            resultClass='lastKnownLocations'
            facetClass='perspective1'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path='/perspective1/faceted-search/statistics'
        render={() =>
          <Network
            results={props.perspective1.results}
            fetchResults={props.fetchResults}
            resultClass='perspective1Network'
            facetClass='perspective1'
          />}
      />
      <Route
        path='/perspective1/faceted-search/migrations'
        render={() =>
          <Deck
            results={props.places.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='placesMsMigrations'
            facetClass='perspective1'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path='/perspective1/faceted-search/export'
        render={() =>
          <Export
            sparqlQuery={props.perspective1.paginatedResultsSparqlQuery}
            pageType='facetResults'
          />}
      />
      {/* <Route
        path='/perspective1/faceted-search/network'
        render={() =>
          <Network />}
      /> */}
    </>
  )
}

Perspective1.propTypes = {
  perspective1: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
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
  screenSize: PropTypes.string.isRequired
}

export default Perspective1
