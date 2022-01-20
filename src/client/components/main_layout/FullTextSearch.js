import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import Box from '@mui/material/Box'
import PerspectiveTabs from './PerspectiveTabs'
import ReactVirtualizedTable from '../facet_results/ReactVirtualizedTable'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay'
import { getSpacing } from '../../helpers/helpers'

/**
 * A component for displaying full text search results.
 */
const FullTextSearch = props => {
  const { rootUrl, layoutConfig, screenSize } = props
  const perspectiveUrl = `${rootUrl}/full-text-search`
  return (
    <Box
      sx={theme => ({
        margin: theme.spacing(0.5),
        [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
          height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
              getSpacing(theme, 1)
              }px)`
        },
        [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
          height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
              getSpacing(theme, 1)
              }px)`
        }
      })}
    >
      <PerspectiveTabs
        tabs={[{
          id: 'table',
          label: 'table',
          icon: <CalendarViewDayIcon />,
          value: 0
        }]}
        screenSize={screenSize}
        layoutConfig={layoutConfig}
      />
      <Route exact path={perspectiveUrl}>
        <Redirect to={`${perspectiveUrl}/table`} />
      </Route>
      <Route path={`${perspectiveUrl}/table`}>
        <ReactVirtualizedTable
          fullTextSearch={props.fullTextSearch}
          resultClass={props.resultClass}
          sortFullTextResults={props.sortFullTextResults}
          layoutConfig={props.layoutConfig}
        />
      </Route>
    </Box>
  )
}

FullTextSearch.propTypes = {
  fullTextSearch: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FullTextSearch
