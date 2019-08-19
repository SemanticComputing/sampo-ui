import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';
// import Tree from './Tree';
import LeafletMap from '../facet_results/LeafletMap';
// import Deck from './Deck';

let Places = props => {
  //console.log(props.search.places)
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={props.perspective.tabs}
      />
      <Route
        exact path='/places/faceted-search'
        render={() => <Redirect to='/places/faceted-search/map' />}
      />
      <Route
        path={'/places/faceted-search/table'}
        render={routeProps =>
          <ResultTable
            data={props.places}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='places'
            facetClass='places'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
      <Route
        path={'/places/faceted-search/map'}
        render={() =>
          <LeafletMap
            results={props.places.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='placesAll'
            facetClass='places'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            mapMode='cluster'
            showInstanceCountInClusters={false}
          />}
      />
    </React.Fragment>
  );
};

Places.propTypes = {
  places: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  perspective: PropTypes.object.isRequired
};

export default Places;
