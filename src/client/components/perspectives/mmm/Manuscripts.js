import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../../main_layout/PerspectiveTabs';
import ResultTable from '../../facet_results/ResultTable';
import LeafletMap from '../../facet_results/LeafletMap';
import Deck from '../../facet_results/Deck';
import Pie from '../../facet_results/Pie';
import Network from '../../facet_results/Network';
import Export from '../../facet_results/Export';

let Manuscripts = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
      />
      <Route
        exact path='/manuscripts/faceted-search'
        render={() => <Redirect to='/manuscripts/faceted-search/table' />}
      />
      <Route
        path={'/manuscripts/faceted-search/table'}
        render={routeProps =>
          <ResultTable
            data={props.manuscripts}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='manuscripts'
            facetClass='manuscripts'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
      <Route
        path={'/manuscripts/faceted-search/production_places'}
        render={() =>
          <LeafletMap
            results={props.places.results}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.productionPlace}
            facetID='productionPlace'
            resultClass='placesMsProduced'
            facetClass='manuscripts'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters={true}
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path={'/manuscripts/faceted-search/last_known_locations'}
        render={() =>
          <LeafletMap
            results={props.places.results}
            pageType='facetResults'
            facetUpdateID={props.facetData.facetUpdateID}
            facet={props.facetData.facets.lastKnownLocation}
            facetID='lastKnownLocation'
            resultClass='lastKnownLocations'
            facetClass='manuscripts'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters={true}
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path={'/manuscripts/faceted-search/statistics'}
        render={() =>
          <Pie
            data={props.places.results}
            fetchResults={props.fetchResults}
          />}
      />
      <Route
        path={'/manuscripts/faceted-search/migrations'}
        render={() =>
          <Deck
            results={props.places.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='placesMsMigrations'
            facetClass='manuscripts'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters={true}
            updateFacetOption={props.updateFacetOption}
          />}
      />
      <Route
        path={'/manuscripts/faceted-search/export'}
        render={() =>
          <Export
            sparqlQuery={props.manuscripts.paginatedResultsSparqlQuery}
            pageType='facetResults'
          />}
      />
      <Route
        path={'/manuscripts/faceted-search/network'}
        render={() =>
          <Network

          />}
      />
    </React.Fragment>
  );
};

Manuscripts.propTypes = {
  manuscripts: PropTypes.object.isRequired,
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
};

export default Manuscripts;
