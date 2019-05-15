import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';

let Events = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={{
          '/events/table': {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          }
        }}
      />
      <Route
        exact path='/events'
        render={() => <Redirect to='events/table' />}
      />
      <Route
        path={'/events/table'}
        render={routeProps =>
          <ResultTable
            data={props.events}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='events'
            facetClass='events'
            fetchPaginatedResults={props.fetchPaginatedResults}
            updatePage={props.updatePage}
            sortResults={props.sortResults}
            routeProps={routeProps}
          />
        }
      />
    </React.Fragment>
  );
};

Events.propTypes = {
  events: PropTypes.object.isRequired,
  places: PropTypes.object,
  facetData: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Events;
