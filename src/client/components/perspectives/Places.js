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
        tabs={{
          '/places/table': {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          },
          '/places/map': {
            label: 'map',
            value: 1,
            icon: 'AddLocation',
          },
        }}
      />
      <Route
        exact path='/places'
        render={() => <Redirect to='places/map' />}
      />
      <Route
        path={'/places/table'}
        render={routeProps =>
          <ResultTable
            data={props.places}
            filters={props.facetData.filters}
            resultClass='places'
            facetClass='places'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
      {/*<Route
        path={'/places/tree'}
        render={() =>
          <Tree
            facetFunctionality={false}
            searchField={true}
            data={props.search.places}
            fetchData={props.fetchPlaces()}
          />
        }
      />*/}
      <Route
        path={'/places/map'}
        render={() =>
          <LeafletMap
            results={props.places.results}
            filters={props.facetData.filters}
            resultClass='places'
            facetClass='places'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            mapMode={'cluster'}
            variant='allPlaces'
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
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Places;
