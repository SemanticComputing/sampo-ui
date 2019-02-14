import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ViewTabs from './ViewTabs';
import ResultTable from './ResultTable';
import Tree from './Tree';
import LeafletMap from './LeafletMap';
// import Deck from './Deck';

let Places = props => {
  //console.log(props.search.places)
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
            results={props.results}
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
        path={'/places/tree'}
        render={() =>
          <Tree
            facetFunctionality={false}
            searchField={true}
            data={props.search.places}
            fetchData={props.fetchPlaces()}
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
  data: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Places;
