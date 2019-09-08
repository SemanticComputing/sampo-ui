import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PerspectiveTabs from '../main_layout/PerspectiveTabs';
import MaterialTableFullTextResults from '../facet_results/MaterialTableFullTextResults';

const All = props => {
  const perspectiveUrl = '/all';
  return (
    <React.Fragment>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={[{
          id: 'table',
          label: 'table',
          icon: 'CalendarViewDay',
          value: 0,
        }]}
      />
      <Route
        exact path={perspectiveUrl}
        render={() => <Redirect to={`${perspectiveUrl}/table`} />}
      />
      <Route
        path={`${perspectiveUrl}/table`}
        render={() => {
          return(
            <MaterialTableFullTextResults
              data={props.clientSideFacetedSearch.results}
              query={props.clientSideFacetedSearch.query}
              fetching={props.clientSideFacetedSearch.textResultsFetching}
            />
          );
        }

        }
      />
    </React.Fragment>
  );
};

All.propTypes = {
  clientSideFacetedSearch: PropTypes.object.isRequired,
  updatePage: PropTypes.func,
  sortResults: PropTypes.func,
  routeProps: PropTypes.object.isRequired,
};

export default All;
