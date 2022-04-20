import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import PerspectiveTabs from './PerspectiveTabs'
import ResultClassRoute from '../facet_results/ResultClassRoute'
import { getLocalIDFromAppLocation, createURIfromLocalID } from '../../helpers/helpers'
import { Route, Redirect } from 'react-router-dom'
import { has } from 'lodash'

const styles = () => ({
  root: {
    width: '100%',
    height: '100%'
  },
  content: props => ({
    padding: 0,
    width: '100%',
    height: `calc(100% - ${props.layoutConfig.tabHeight}px)`,
    overflow: 'auto'
  }),
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

/**
 * A component for generating a page for a single entity.
 */
class InstancePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      localID: null
    }
  }

  componentDidMount = () => this.fetchTableData()

  componentDidUpdate = prevProps => {
    // handle the case when the TABLE tab was not originally active
    const prevPathname = prevProps.location.pathname
    const currentPathname = this.props.location.pathname
    if (!this.hasTableData() && prevPathname !== currentPathname && currentPathname.endsWith('table')) {
      this.fetchTableData()
    }
    // handle browser's back button
    const localID = this.getLocalID()
    if (this.state.localID !== localID) {
      this.fetchTableData()
    }
  }

  getLocalID = () => {
    return getLocalIDFromAppLocation({
      location: this.props.location,
      perspectiveConfig: this.props.perspectiveConfig
    })
  }

  hasTableData = () => {
    const { instanceTableData } = this.props.perspectiveState
    return instanceTableData !== null && Object.values(instanceTableData).length >= 1
  }

  fetchTableData = () => {
    const { perspectiveConfig } = this.props
    const { baseURI, baseURIs, URITemplate, id } = perspectiveConfig
    const localID = this.getLocalID()
    this.setState({ localID })
    let uri = null
    if (!baseURI) {
      for (const localIDPrefix in baseURIs) {
        if (localID.startsWith(localIDPrefix)) {
          const { baseURI, URITemplate } = baseURIs[localIDPrefix]
          uri = createURIfromLocalID({ localID, baseURI, URITemplate })
        }
      }
      if (uri === null) {
        const { baseURI, URITemplate } = baseURIs.noLocalIDPrefix
        uri = createURIfromLocalID({ localID, baseURI, URITemplate })
      }
    } else {
      uri = createURIfromLocalID({ localID, baseURI, URITemplate })
    }
    this.props.fetchByURI({
      perspectiveID: id,
      resultClass: id,
      facetClass: null,
      variant: null,
      uri
    })
  }

  getVisibleRows = rows => {
    const { instanceTableData } = this.props.perspectiveState
    const visibleRows = []
    const instanceClass = instanceTableData.type ? instanceTableData.type.id : ''
    rows.forEach(row => {
      if ((has(row, 'onlyForClass') && row.onlyForClass === instanceClass) ||
       !has(row, 'onlyForClass')) {
        visibleRows.push(row)
      }
    })
    return visibleRows
  }

  render = () => {
    const { classes, perspectiveState, perspectiveConfig, rootUrl, screenSize, layoutConfig } = this.props
    const { fetching } = perspectiveState
    const resultClass = perspectiveConfig.id
    const defaultInstancePageTab = perspectiveConfig.defaultInstancePageTab
      ? perspectiveConfig.defaultInstancePageTab
      : 'table'
    let instancePageResultClasses = null
    if (has(perspectiveConfig.resultClasses[resultClass].instanceConfig, 'instancePageResultClasses')) {
      instancePageResultClasses = perspectiveConfig.resultClasses[resultClass].instanceConfig.instancePageResultClasses
    }
    const hasTableData = this.hasTableData()
    return (
      <div className={classes.root}>
        <PerspectiveTabs
          tabs={perspectiveConfig.instancePageTabs}
          screenSize={screenSize}
          layoutConfig={layoutConfig}
        />
        <Paper square className={classes.content}>
          {fetching && !hasTableData &&
            <div className={classes.spinnerContainer}>
              <CircularProgress />
            </div>}
          {!hasTableData &&
            <div className={classes.spinnerContainer}>
              <Typography variant='h6'>
                No data found for id: <span style={{ fontStyle: 'italic' }}>{this.state.localID}</span>
              </Typography>
            </div>}
          {/* make sure that tableData exists before rendering any components */}
          {hasTableData &&
            <>
              <Route
                exact path={`${rootUrl}/${resultClass}/page/${this.state.localID}`}
                render={routeProps =>
                  <Redirect
                    to={{
                      pathname: `${rootUrl}/${resultClass}/page/${this.state.localID}/${defaultInstancePageTab}`,
                      hash: routeProps.location.hash
                    }}
                  />}
              />
              {instancePageResultClasses && Object.keys(instancePageResultClasses).map(instancePageResultClass => {
                let resultClassConfig = instancePageResultClasses[instancePageResultClass]
                if (has(resultClassConfig, 'paginatedResultsConfig')) {
                  resultClassConfig = resultClassConfig.paginatedResultsConfig
                }
                if (!has(resultClassConfig, 'component')) {
                  return null
                }
                const { tabPath } = resultClassConfig
                const path = `${rootUrl}/${resultClass}/page/${this.state.localID}/${tabPath}`
                return (
                  <ResultClassRoute
                    key={instancePageResultClass}
                    path={path}
                    defaultResultClass={resultClass}
                    resultClass={instancePageResultClass}
                    resultClassConfig={resultClassConfig}
                    localID={this.state.localID}
                    {...this.props}
                  />
                )
              })}
            </>}
        </Paper>
      </div>
    )
  }
}

InstancePage.propTypes = {
  /**
   * Faceted search configs and results of this perspective.
   */
  perspectiveState: PropTypes.object.isRequired,
  /**
    * Leaflet map config and external layers.
    */
  leafletMapState: PropTypes.object.isRequired,
  /**
    * Redux action for fetching paginated results.
    */
  fetchPaginatedResults: PropTypes.func.isRequired,
  /**
    * Redux action for fetching all results.
    */
  fetchResults: PropTypes.func.isRequired,
  /**
    * Redux action for fetching facet values for statistics.
    */
  fetchFacetConstrainSelf: PropTypes.func.isRequired,
  /**
    * Redux action for loading external GeoJSON layers.
    */
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  /**
    * Redux action for loading external GeoJSON layers via backend.
    */
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  /**
    * Redux action for clearing external GeoJSON layers.
    */
  clearGeoJSONLayers: PropTypes.func.isRequired,
  /**
    * Redux action for fetching information about a single entity.
    */
  fetchByURI: PropTypes.func.isRequired,
  /**
    * Redux action for updating the page of paginated results.
    */
  updatePage: PropTypes.func.isRequired,
  /**
    * Redux action for updating the rows per page of paginated results.
    */
  updateRowsPerPage: PropTypes.func.isRequired,
  /**
    * Redux action for sorting the paginated results.
    */
  sortResults: PropTypes.func.isRequired,
  /**
    * Redux action for updating the active selection or config of a facet.
    */
  showError: PropTypes.func.isRequired,
  /**
    * Redux action for showing an error
    */
  updateFacetOption: PropTypes.func.isRequired,
  /**
    * Routing information from React Router.
    */
  location: PropTypes.object.isRequired,
  /**
    * Perspective config.
    */
  perspective: PropTypes.object.isRequired,
  /**
    * State of the animation, used by TemporalMap.
    */
  animationValue: PropTypes.array.isRequired,
  /**
    * Redux action for animating TemporalMap.
    */
  animateMap: PropTypes.func.isRequired,
  /**
    * Current screen size.
    */
  screenSize: PropTypes.string.isRequired,
  /**
    * Root url of the application.
    */
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export const InstanceHomePageComponent = InstancePage

export default withStyles(styles)(InstancePage)
