import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import PerspectiveTabs from '../../main_layout/PerspectiveTabs'
import ReactVirtualizedTable from '../../facet_results/ReactVirtualizedTable'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'

const useStyles = makeStyles(theme => ({
  root: props => ({
    marginTop: theme.spacing(0.5),
    height: `calc(100% - ${props.layoutConfig.tabHeight - 18}px)`
  })
}))

/**
 * A component for displaying full text search results.
 */
const FullTextSearch = props => {
  const { rootUrl, layoutConfig, screenSize } = props
  const classes = useStyles(props)
  const perspectiveUrl = `${rootUrl}/full-text-search`
  return (
    <div className={classes.root}>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={[{
          id: 'table',
          label: 'table',
          icon: <CalendarViewDayIcon />,
          value: 0
        }]}
        screenSize={screenSize}
        layoutConfig={layoutConfig}
      />
      <Route
        exact path={perspectiveUrl}
        render={() => <Redirect to={`${perspectiveUrl}/table`} />}
      />
      <Route
        path={`${perspectiveUrl}/table`}
        render={() => {
          return (
            <ReactVirtualizedTable
              fullTextSearch={props.fullTextSearch}
              sortFullTextResults={props.sortFullTextResults}
              layoutConfig={props.layoutConfig}
            />
          )
        }}
      />
    </div>
  )
}

FullTextSearch.propTypes = {
  fullTextSearch: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FullTextSearch
