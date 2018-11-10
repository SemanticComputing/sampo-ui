import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import ViewTabs from './ViewTabs';
import ResultTable from './ResultTable';
import LeafletMap from './LeafletMap';
import Deck from './Deck';
import Pie from './Pie';

let Manuscripts = props => {
  return (
    <React.Fragment>
      <ViewTabs />
      <Switch>
        <Route
          path={props.match.url + '/table'}
          render={() =>
            <ResultTable
              rows={props.search.manuscripts}
              facet={props.facet}
              fetchManuscripts={props.fetchManuscripts}
              fetchingManuscripts={props.search.fetchingManuscripts}
              fetchFacet={props.fetchFacet}
              fetchResults={props.fetchResults}
              results={props.search.results}
              updateFilter={props.updateFilter}
              page={props.search.page}
            />}
        />
        <Route
          path={props.match.url + '/creation_places'}
          render={() =>
            <LeafletMap
              fetchPlaces={props.fetchPlaces}
              fetchPlace={props.fetchPlace}
              results={props.search.places}
              mapMode='cluster'
            />}
        />
        <Route
          path={props.match.url + '/migrations'}
          render={() =>
            <Deck
              fetchPlaces={props.fetchPlaces}
              fetchingPlaces={props.search.fetchingPlaces}
              data={props.search.places}
            />}
        />
        <Route
          path={props.match.url + '/statistics'}
          render={() =>
            <Pie
              fetchPlaces={props.fetchPlaces}
              fetchingPlaces={props.search.fetchingPlaces}
              data={props.search.places}
            />}
        />
      </Switch>
    </React.Fragment>
  );
};

Manuscripts.propTypes = {
  facet: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default Manuscripts;
