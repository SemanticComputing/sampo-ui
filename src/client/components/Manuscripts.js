import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ViewTabs from './ViewTabs';
import ResultTable from './ResultTable';
import LeafletMap from './LeafletMap';
import Deck from './Deck';

let Manuscripts = props => {
  return (
    <React.Fragment>
      <ViewTabs
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
            results={props.search.results}
            resultClass='manuscripts'
            columns={props.search.manuscriptTableColumns}
            search={props.search}
            facetFilters={props.facetFilters}
            fetchResults={props.fetchResults}
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
            fetchPlaces={props.fetchPlaces}
            fetchingPlaces={props.search.fetchingPlaces}
            fetchPlace={props.fetchPlace}
            results={props.search.places}
            place={props.search.place}
            mapMode='cluster'
            variant='productionPlaces'
          />}
      />
      <Route
        path={'/manuscripts/migrations'}
        render={() =>
          <Deck
            fetchPlaces={props.fetchPlaces}
            fetchingPlaces={props.search.fetchingPlaces}
            data={props.search.places}
          />}
      />
    </React.Fragment>
  );
};

Manuscripts.propTypes = {
  search: PropTypes.object.isRequired,
  facetFilters: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Manuscripts;
