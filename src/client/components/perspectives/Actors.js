import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';

let Actors = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={{
          '/actors/table': {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          },
          // '/people/map': {
          //   label: 'map',
          //   value: 1,
          //   icon: 'AddLocation',
          // },
        }}
      />
      <Route
        exact path='/actors'
        render={() => <Redirect to='actors/table' />}
      />
      <Route
        path={'/actors/table'}
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
  routeProps: PropTypes.object.isRequired
};

export default Actors;
