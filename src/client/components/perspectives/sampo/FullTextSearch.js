import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import MaterialTableFullTextResults from '../../facet_results/MaterialTableFullTextResults'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'

/**
 * A component for displaying full text search results.
 */
const FullTextSearch = props => {
  const { rootUrl } = props
  const perspectiveUrl = `${rootUrl}/full-text-search`
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        screenSize={props.screenSize}
        tabs={[{
          id: 'table',
          label: 'table',
          icon: <CalendarViewDayIcon />,
          value: 0
        }]}
      />
      <Route
        exact path={perspectiveUrl}
        render={() => <Redirect to={`${perspectiveUrl}/table`} />}
      />
      <Route
        path={`${perspectiveUrl}/table`}
        render={() => {
          return (
            <MaterialTableFullTextResults
              data={props.fullTextSearch.results || []}
              query={props.fullTextSearch.query}
              fetching={props.fullTextSearch.fetching}
            />
          )
        }}
      />
    </>
  )
}

FullTextSearch.propTypes = {
  fullTextSearch: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FullTextSearch
