import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable from '../facet_results/ResultTable';

let Works = props => {
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={{
          '/works/table': {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          },
          // '/works/map': {
          //   label: 'map',
          //   value: 1,
          //   icon: 'AddLocation',
          // },
        }}
      />
      <Route
        exact path='/works'
        render={() => <Redirect to='works/table' />}
      />
      <Route
        path={'/works/table'}
        render={routeProps =>
          <ResultTable
            data={props.works}
            facetUpdateID={props.facetData.facetUpdateID}
            resultClass='works'
            facetClass='works'
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

Works.propTypes = {
  works: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  facetData: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default Works;
