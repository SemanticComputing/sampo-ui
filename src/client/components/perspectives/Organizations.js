import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';

let Organizations = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={{
          '/organizations/table': {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          },
          // '/organizations/map': {
          //   label: 'map',
          //   value: 1,
          //   icon: 'AddLocation',
          // },
        }}
      />
      <Route
        exact path='/organizations'
        render={() => <Redirect to='organizations/table' />}
      />
      <Route
        path={'/organizations/table'}
        render={routeProps =>
          <ResultTable
            data={props.organizations}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='organizations'
            facetClass='organizations'
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

Organizations.propTypes = {
  organizations: PropTypes.object.isRequired,
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

export default Organizations;
