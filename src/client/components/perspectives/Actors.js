import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';
import LeafletMap from '../facet_results/LeafletMap';

let Actors = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
      />
      <Route
        exact path='/actors/faceted-search'
        render={() => <Redirect to='/actors/faceted-search/table' />}
      />
      <Route
        path={'/actors/faceted-search/table'}
        render={routeProps =>
          <ResultTable
            data={props.actors}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='actors'
            facetClass='actors'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
      <Route
        path={'/actors/faceted-search/map'}
        render={() =>
          <LeafletMap
            results={props.places.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='placesActors'
            facetClass='actors'
            mapMode='cluster'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            showInstanceCountInClusters={true}
            updateFacetOption={props.updateFacetOption}
          />}
      />
    </React.Fragment>
  );
};

Actors.propTypes = {
  actors: PropTypes.object.isRequired,
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
  perspective: PropTypes.object.isRequired
};

export default Actors;
