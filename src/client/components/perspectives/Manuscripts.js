import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';
import LeafletMap from '../facet_results/LeafletMap';
import Deck from '../facet_results/Deck';

let Manuscripts = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={{
          '/manuscripts/table': {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          },
          '/manuscripts/production_places': {
            label: 'production places',
            value: 1,
            icon: 'AddLocation',
          },
          '/manuscripts/migrations': {
            label: 'migrations',
            value: 2,
            icon: 'Redo',
          }
        }}
      />
      <Route
        exact path='/manuscripts'
        render={() => <Redirect to='manuscripts/table' />}
      />
      <Route
        path={'/manuscripts/table'}
        render={routeProps =>
          <ResultTable
            data={props.manuscripts}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='manuscripts'
            facetClass='manuscripts'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
      <Route
        path={'/manuscripts/production_places'}
        render={() =>
          <LeafletMap
            results={props.places.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='places'
            facetClass='manuscripts'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            mapMode={'cluster'}
            variant='productionPlaces'
            showInstanceCountInClusters={true}
            updateSpatialFilter={props.updateSpatialFilter}
            property={'productionPlace'}
          />}
      />
      <Route
        path={'/manuscripts/migrations'}
        render={() =>
          <Deck
            results={props.places.results}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='places'
            facetClass='manuscripts'
            instance={props.places.instance}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            fetching={props.places.fetching}
            mapMode={'cluster'}
            variant='migrations'
            showInstanceCountInClusters={true}
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
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired,
  updateSpatialFilter: PropTypes.func.isRequired
};

export default Manuscripts;
