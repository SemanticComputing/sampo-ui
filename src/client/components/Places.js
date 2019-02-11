import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ViewTabs from './ViewTabs';
import ResultTable from './ResultTable';
import LeafletMap from './LeafletMap';
// import Deck from './Deck';

let Places = props => {
  return (
    <React.Fragment>
      <ViewTabs
        routeProps={props.routeProps}
        tabs={{
          '/places/map': {
            label: 'map',
            value: 0,
            icon: 'AddLocation',
          },
          // '/places/table': {
          //   label: 'table',
          //   value: 1,
          //   icon: 'CalendarViewDay',
          // },
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
            results={props.search.places}
            resultClass='places'
            columns={props.search.placeTableColumns}
            search={props.search}
            facetFilters={props.facetFilters}
            fetchResults={props.fetchPlaces}
            updatePage={props.updatePage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
      <Route
        path={'/places/map'}
        render={() =>
          <LeafletMap
            fetchPlaces={props.fetchPlaces}
            fetchingPlaces={props.search.fetchingPlaces}
            fetchPlace={props.fetchPlace}
            results={props.search.places}
            place={props.search.place}
            mapMode='cluster'
            variant='allPlaces'
          />}
      />
    </React.Fragment>
  );
};

Places.propTypes = {
  search: PropTypes.object.isRequired,
  facetFilters: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Places;
