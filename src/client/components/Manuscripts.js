import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ViewTabs from './ViewTabs';
import ResultTable from './ResultTable';
import LeafletMap from './LeafletMap';
import Deck from './Deck';
import Pie from './Pie';

let Manuscripts = props => {
  //console.log(props.routeProps)
  return (
    <React.Fragment>
      <ViewTabs routeProps={props.routeProps} />
      <Route
        exact path='/manuscripts'
        render={() => <Redirect to='manuscripts/table' />}
      />
      <Route
        path={'/manuscripts/table'}
        render={routeProps =>
          <ResultTable
            rows={props.search.manuscripts}
            fetchManuscripts={props.fetchManuscripts}
            fetchingManuscripts={props.search.fetchingManuscripts}
            resultCount={props.search.manuscriptCount}
            page={props.search.page}
            updatePage={props.updatePage}
            openFacetDialog={props.openFacetDialog}
            routeProps={routeProps}
          />
        }
      />
      <Route
        path={'/manuscripts/creation_places'}
        render={() =>
          <LeafletMap
            fetchPlaces={props.fetchPlaces}
            fetchPlace={props.fetchPlace}
            results={props.search.places}
            place={props.search.place}
            mapMode='cluster'
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
  map: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchPlace:  PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  openFacetDialog: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Manuscripts;
