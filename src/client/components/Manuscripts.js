import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ViewTabs from './ViewTabs';
import ResultTable from './ResultTable';
import LeafletMap from './LeafletMap';
import Deck from './Deck';
import Pie from './Pie';

let Manuscripts = props => {
  return (
    <React.Fragment>
      <Route
        exact path='/manuscripts'
        render={() => <Redirect to='manuscripts/table' />}
      />
      <ViewTabs routeProps={props.routeProps} />
      <Route
        path={'/manuscripts/table'}
        render={routeProps =>
          <ResultTable
            search={props.search}
            facetFilters={props.facetFilters}
            fetchManuscripts={props.fetchManuscripts}
            fetchingManuscripts={props.search.fetchingManuscripts}
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
      <Route
        path={'/manuscripts/statistics'}
        render={() =>
          <Pie
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
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Manuscripts;
