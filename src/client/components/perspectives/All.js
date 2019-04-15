import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import ResultTable2 from '../facet_results/ResultTable2';

const All = props => {
  const perspectiveUrl = '/all';
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={{
          [`${perspectiveUrl}/table`]: {
            label: 'table',
            value: 0,
            icon: 'CalendarViewDay',
          },
          [`${perspectiveUrl}/map`]: {
            label: 'map',
            value: 1,
            icon: 'AddLocation',
          },
        }}
      />
      <Route
        exact path={perspectiveUrl}
        render={() => <Redirect to={`${perspectiveUrl}/table`} />}
      />
      <Route
        path={`${perspectiveUrl}/table`}
        render={() =>
          <ResultTable2
            data={props.results}
          />
        }
      />
    </React.Fragment>
  );
};

All.propTypes = {
  results: PropTypes.array,
  updatePage: PropTypes.func,
  sortResults: PropTypes.func,
  routeProps: PropTypes.object.isRequired,
};

export default All;
