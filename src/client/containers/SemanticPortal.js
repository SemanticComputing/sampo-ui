import React, { useEffect, lazy } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import { connect } from 'react-redux'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'
import { compose } from '@shakacode/recompose'

import Box from '@mui/material/Box'
import {
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchInstanceAnalysis,
  fetchFullTextResults,
  sortFullTextResults,
  clearResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  clearFacet,
  clearAllFacets,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  clearGeoJSONLayers,
  sortResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  updateVideoPlayerTime,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSSortResults,
  clientFSClearResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet,
  fetchKnowledgeGraphMetadata
} from '../actions'
import { filterResults } from '../selectors'
import {
  processPortalConfig,
  createPerspectiveConfig,
  createPerspectiveConfigOnlyInfoPages,
  getScreenSize
} from '../helpers/helpers'
import * as apexChartsConfig from '../library_configs/ApexCharts/ApexChartsConfig'
import * as leafletConfig from '../library_configs/Leaflet/LeafletConfig'
import * as networkConfig from '../library_configs/Cytoscape.js/NetworkConfig'

// ** Generate portal configuration based on JSON configs **
import portalConfig from '../../configs/portalConfig.json'
await processPortalConfig(portalConfig)
const {
  portalID,
  rootUrl,
  perspectives,
  layoutConfig,
  knowledgeGraphMetadataConfig
} = portalConfig
const perspectiveConfig = await createPerspectiveConfig({
  portalID,
  searchPerspectives: perspectives.searchPerspectives
})
const perspectiveConfigOnlyInfoPages = await createPerspectiveConfigOnlyInfoPages({
  portalID,
  onlyInstancePagePerspectives: perspectives.onlyInstancePages
})
// ** portal configuration end **

// ** Import general components **
const TopBar = lazy(() => import('../components/main_layout/TopBar'))
const TextPage = lazy(() => import('../components/main_layout/TextPage'))
const Message = lazy(() => import('../components/main_layout/Message'))
const FullTextSearch = lazy(() => import('../components/main_layout/FullTextSearch'))
const FacetedSearchPerspective = lazy(() => import('../components/facet_results/FacetedSearchPerspective'))
const FederatedSearchPerspective = lazy(() => import('../components/facet_results/FederatedSearchPerspective'))
const InstancePagePerspective = lazy(() => import('../components/main_layout/InstancePagePerspective'))
const KnowledgeGraphMetadataTable = lazy(() => import('../components/main_layout/KnowledgeGraphMetadataTable'))
// ** General components end **

// ** Import portal specific components **
const Main = lazy(() => import(`../components/perspectives/${portalID}/Main`))
const Footer = lazy(() => import(`../components/perspectives/${portalID}/Footer`))
// ** Portal specific components end **

/**
 * A top-level container component, which connects all Sampo-UI components to the Redux store. Also
 * the main routes of the portal are defined here using React Router. Currently it is not possible to
 * render this component in Storybook.
 */
const SemanticPortal = props => {
  const { error } = props
  const rootUrlWithLang = `${rootUrl}/${props.options.currentLocale}`
  const screenSize = getScreenSize()
  const noClientFSResults = props.clientFSState && props.clientFSState.results === null

  useEffect(() => {
    document.title = intl.get('html.title')
    document.documentElement.lang = props.options.currentLocale
    document.querySelector('meta[name="description"]').setAttribute('content', intl.get('html.description'))
  }, [props.options.currentLocale])

  return (
    <Box
      sx={theme => ({
        backgroundColor: '#bdbdbd',
        overflowX: 'hidden',
        minHeight: '100%',
        [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
          overflow: 'hidden',
          height: '100%'
        }
      })}
    >
      <Message error={error} />
      <>
        <TopBar
          rootUrl={rootUrlWithLang}
          search={props.fullTextSearch}
          fetchFullTextResults={props.fetchFullTextResults}
          clearResults={props.clearResults}
          clientFSClearResults={props.clientFSClearResults}
          perspectives={perspectiveConfig}
          currentLocale={props.options.currentLocale}
          availableLocales={props.options.availableLocales}
          loadLocales={props.loadLocales}
          screenSize={screenSize}
          location={props.location}
          layoutConfig={layoutConfig}
        />
        <Route exact path={`${rootUrl}/`}>
          <Redirect to={rootUrlWithLang} />
        </Route>
        <Route
          exact path={`${rootUrlWithLang}/`}
          render={() =>
            <>
              <Main
                perspectives={perspectiveConfig}
                screenSize={screenSize}
                rootUrl={rootUrlWithLang}
                layoutConfig={layoutConfig}
              />
              <Footer
                portalConfig={portalConfig}
                layoutConfig={layoutConfig}
              />
            </>}
        />
        {/* https://stackoverflow.com/a/41024944 */}
        <Route
          path={`${rootUrlWithLang}/`} render={({ location }) => {
            if (typeof window.ga === 'function') {
              window.ga('set', 'page', location.pathname + location.search)
              window.ga('send', 'pageview')
            }
            return null
          }}
        />
        {/* route for full text search results */}
        <Route
          path={`${rootUrlWithLang}/full-text-search`}
          render={routeProps =>
            <FullTextSearch
              fullTextSearch={props.fullTextSearch}
              resultClass='fullTextSearch'
              sortFullTextResults={props.sortFullTextResults}
              routeProps={routeProps}
              screenSize={screenSize}
              rootUrl={rootUrlWithLang}
              layoutConfig={layoutConfig}
            />}
        />
        {/* routes for faceted search perspectives */}
        {perspectiveConfig.map(perspective => {
          if (!has(perspective, 'externalUrl') && perspective.searchMode === 'faceted-search') {
            return (
              <React.Fragment key={perspective.id}>
                <Route
                  path={`${rootUrlWithLang}/${perspective.id}/faceted-search`}
                  render={routeProps =>
                    <FacetedSearchPerspective
                      portalConfig={portalConfig}
                      perspectiveConfig={perspective}
                      layoutConfig={layoutConfig}
                      facetedSearchMode='serverFS'
                      facetState={props[`${perspective.id}Facets`]}
                      facetStateConstrainSelf={props[`${perspective.id}FacetsConstrainSelf`]}
                      perspectiveState={props[perspective.id]}
                      facetClass={perspective.id}
                      resultClass={perspective.id}
                      fetchingResultCount={props[perspective.id].fetchingResultCount}
                      resultCount={props[perspective.id].resultCount}
                      fetchFacet={props.fetchFacet}
                      fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                      fetchResults={props.fetchResults}
                      clearFacet={props.clearFacet}
                      clearAllFacets={props.clearAllFacets}
                      fetchResultCount={props.fetchResultCount}
                      updateFacetOption={props.updateFacetOption}
                      showError={props.showError}
                      defaultActiveFacets={perspective.defaultActiveFacets}
                      rootUrl={rootUrlWithLang}
                      screenSize={screenSize}
                      apexChartsConfig={apexChartsConfig}
                      leafletConfig={leafletConfig}
                      networkConfig={networkConfig}
                      leafletMapState={props.leafletMap}
                      fetchPaginatedResults={props.fetchPaginatedResults}
                      fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                      fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                      fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                      clearGeoJSONLayers={props.clearGeoJSONLayers}
                      fetchByURI={props.fetchByURI}
                      updatePage={props.updatePage}
                      updateRowsPerPage={props.updateRowsPerPage}
                      updateMapBounds={props.updateMapBounds}
                      updatePerspectiveHeaderExpanded={props.updatePerspectiveHeaderExpanded}
                      sortResults={props.sortResults}
                      routeProps={routeProps}
                      perspective={perspective}
                      animationValue={props.animationValue}
                      animateMap={props.animateMap}
                    />}
                />
                <Switch>
                  <Redirect
                    from={`/${perspective.id}/page/:id`}
                    to={{
                      pathname: `${rootUrlWithLang}/${perspective.id}/page/:id`,
                      hash: props.location.hash
                    }}
                  />
                  <Route
                    path={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                    render={routeProps =>
                      <InstancePagePerspective
                        portalConfig={portalConfig}
                        layoutConfig={layoutConfig}
                        perspectiveConfig={perspective}
                        perspectiveState={props[`${perspective.id}`]}
                        leafletMapState={props.leafletMap}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchResults={props.fetchResults}
                        fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                        fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                        fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                        fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                        clearGeoJSONLayers={props.clearGeoJSONLayers}
                        fetchByURI={props.fetchByURI}
                        updatePage={props.updatePage}
                        updateRowsPerPage={props.updateRowsPerPage}
                        updateFacetOption={props.updateFacetOption}
                        updateMapBounds={props.updateMapBounds}
                        sortResults={props.sortResults}
                        showError={props.showError}
                        routeProps={routeProps}
                        perspective={perspective}
                        animationValue={props.animationValue}
                        animateMap={props.animateMap}
                        videoPlayerState={props.videoPlayer}
                        updateVideoPlayerTime={props.updateVideoPlayerTime}
                        updatePerspectiveHeaderExpanded={props.updatePerspectiveHeaderExpanded}
                        screenSize={screenSize}
                        rootUrl={rootUrlWithLang}
                        apexChartsConfig={apexChartsConfig}
                        leafletConfig={leafletConfig}
                        networkConfig={networkConfig}
                      />}
                  />
                </Switch>
              </React.Fragment>
            )
          }
          return null
        })}
        {/* create routes for classes that have only info pages and no faceted search perspective */}
        {perspectiveConfigOnlyInfoPages.map(perspective =>
          <Switch key={perspective.id}>
            <Redirect
              from={`${rootUrl}/${perspective.id}/page/:id`}
              to={`${rootUrlWithLang}/${perspective.id}/page/:id`}
            />
            <Route
              path={`${rootUrlWithLang}/${perspective.id}/page/:id`}
              render={routeProps =>
                <InstancePagePerspective
                  portalConfig={portalConfig}
                  layoutConfig={layoutConfig}
                  perspectiveConfig={perspective}
                  perspectiveState={props[`${perspective.id}`]}
                  leafletMapState={props.leafletMap}
                  fetchPaginatedResults={props.fetchPaginatedResults}
                  fetchResults={props.fetchResults}
                  fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                  fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                  fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                  fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                  clearGeoJSONLayers={props.clearGeoJSONLayers}
                  fetchByURI={props.fetchByURI}
                  updatePage={props.updatePage}
                  updateRowsPerPage={props.updateRowsPerPage}
                  updateFacetOption={props.updateFacetOption}
                  updateMapBounds={props.updateMapBounds}
                  sortResults={props.sortResults}
                  showError={props.showError}
                  routeProps={routeProps}
                  perspective={perspective}
                  animationValue={props.animationValue}
                  animateMap={props.animateMap}
                  videoPlayerState={props.videoPlayer}
                  updateVideoPlayerTime={props.updateVideoPlayerTime}
                  screenSize={screenSize}
                  rootUrl={rootUrlWithLang}
                  apexChartsConfig={apexChartsConfig}
                  leafletConfig={leafletConfig}
                  networkConfig={networkConfig}
                />}
            />
          </Switch>
        )}
        <Route
          path={`${rootUrlWithLang}/perspective4/federated-search`}
          render={routeProps =>
            <FederatedSearchPerspective
              portalConfig={portalConfig}
              layoutConfig={layoutConfig}
              facetedSearchMode='clientFS'
              facetClass='perspective4'
              resultClass='perspective4'
              facetState={props.clientFSState}
              clientFSFacetValues={props.clientFSFacetValues}
              fetchingResultCount={props.clientFSState.textResultsFetching}
              resultCount={noClientFSResults ? 0 : props.clientFSState.results.length}
              noClientFSResults={noClientFSResults}
              clientFSState={props.clientFSState}
              clientFSToggleDataset={props.clientFSToggleDataset}
              clientFSFetchResults={props.clientFSFetchResults}
              clientFSClearResults={props.clientFSClearResults}
              clientFSUpdateQuery={props.clientFSUpdateQuery}
              clientFSUpdateFacet={props.clientFSUpdateFacet}
              defaultActiveFacets={perspectiveConfig.find(p => p.id === 'perspective4').defaultActiveFacets}
              updateMapBounds={props.updateMapBounds}
              screenSize={screenSize}
              showError={props.showError}
              rootUrl={rootUrlWithLang}
              apexChartsConfig={apexChartsConfig}
              leafletConfig={leafletConfig}
              networkConfig={networkConfig}
              perspective={perspectiveConfig.find(p => p.id === 'perspective4')}
              routeProps={routeProps}
              clientFSResults={props.clientFSResults}
              clientFSSortResults={props.clientFSSortResults}
              leafletMapState={props.leafletMap}
              fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
              fetchGeoJSONLayers={props.fetchGeoJSONLayers}
              clearGeoJSONLayers={props.clearGeoJSONLayers}
            />}
        />
        {/* create routes for info buttons */}
        {!layoutConfig.topBar.externalAboutPage &&
          <Route
            path={`${rootUrlWithLang}/about`}
            render={() =>
              <TextPage layoutConfig={layoutConfig}>
                {intl.getHTML('aboutThePortalPartOne')}
                {knowledgeGraphMetadataConfig.showTable &&
                  <KnowledgeGraphMetadataTable
                    portalConfig={portalConfig}
                    layoutConfig={layoutConfig}
                    perspectiveID={knowledgeGraphMetadataConfig.perspective}
                    resultClass='knowledgeGraphMetadata'
                    fetchKnowledgeGraphMetadata={props.fetchKnowledgeGraphMetadata}
                    knowledgeGraphMetadata={props[knowledgeGraphMetadataConfig.perspective]
                      ? props[knowledgeGraphMetadataConfig.perspective].knowledgeGraphMetadata
                      : null}
                  />}
                {intl.getHTML('aboutThePortalPartTwo')}
              </TextPage>}
          />}
        {!layoutConfig.topBar.externalInstructions &&
          <Route
            path={`${rootUrlWithLang}/instructions`}
            render={() =>
              <TextPage layoutConfig={layoutConfig}>
                {intl.getHTML('instructions')}
              </TextPage>}
          />}
      </>
    </Box>
  )
}

const mapStateToProps = state => {
  const stateToProps = {}
  perspectiveConfig.forEach(perspective => {
    const { id, searchMode } = perspective
    if (searchMode && searchMode === 'federated-search') {
      const perspectiveState = state[id]
      const { clientFSResults, clientFSFacetValues } = filterResults(perspectiveState)
      stateToProps.clientFSState = perspectiveState
      stateToProps.clientFSResults = clientFSResults
      stateToProps.clientFSFacetValues = clientFSFacetValues
    } else {
      stateToProps[id] = state[id]
      stateToProps[`${id}Facets`] = state[`${id}Facets`]
      if (has(state, `${id}FacetsConstrainSelf`)) {
        stateToProps[`${id}FacetsConstrainSelf`] = state[`${id}FacetsConstrainSelf`]
      }
    }
  })
  perspectiveConfigOnlyInfoPages.forEach(perspective => {
    const { id } = perspective
    stateToProps[id] = state[id]
  })
  stateToProps.leafletMap = state.leafletMap
  stateToProps.fullTextSearch = state.fullTextSearch
  stateToProps.animationValue = state.animation.value
  stateToProps.videoPlayer = state.videoPlayer
  stateToProps.options = state.options
  stateToProps.error = state.error
  return stateToProps
}

const mapDispatchToProps = ({
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchInstanceAnalysis,
  fetchFullTextResults,
  sortFullTextResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  clearFacet,
  clearAllFacets,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  clearGeoJSONLayers,
  sortResults,
  clearResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  updateVideoPlayerTime,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSClearResults,
  clientFSSortResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet,
  fetchKnowledgeGraphMetadata
})

SemanticPortal.propTypes = {
  /**
   * General options considering the whole semantic portal, e.g. language.
   */
  options: PropTypes.object.isRequired,
  /**
   * Errors shown with react-redux-toastr.
   */
  error: PropTypes.object.isRequired,
  /**
   * Leaflet map config and external layers.
   */
  leafletMap: PropTypes.object,
  /**
   * State of the animation, used by TemporalMap.
   */
  animationValue: PropTypes.array,
  /**
   * Redux action for fetching all faceted search results.
   */
  fetchResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching the total count faceted search results.
   */
  fetchResultCount: PropTypes.func.isRequired,
  /**
   * Redux action for full text search results.
   */
  fetchFullTextResults: PropTypes.func,
  /**
   * Redux action for fetching paginated faceted search results.
   */
  fetchPaginatedResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching information about a single entity.
   */
  fetchByURI: PropTypes.func.isRequired,
  /**
   * Redux action for loading external GeoJSON layers.
   */
  fetchGeoJSONLayers: PropTypes.func,
  /**
   * Redux action for clearing external GeoJSON layers.
   */
  clearGeoJSONLayers: PropTypes.func,
  /**
   * Redux action for loading external GeoJSON layers via the backend.
   * Useful when the API or similar needs to be hidden.
   */
  fetchGeoJSONLayersBackend: PropTypes.func,
  /**
   * Redux action for sorting the paginated results.
   */
  sortResults: PropTypes.func.isRequired,
  /**
   * Redux action for clearing the full text results.
   */
  clearResults: PropTypes.func.isRequired,
  /**
   * Redux action for updating the page of paginated faceted search results.
   */
  updatePage: PropTypes.func.isRequired,
  /**
   * Redux action for updating the rows per page of paginated faceted search results.
   */
  updateRowsPerPage: PropTypes.func.isRequired,
  /**
   * Redux action for updating the active selection or config of a facet.
   */
  updateFacetOption: PropTypes.func.isRequired,
  /**
   * Redux action for fetching the values of a facet.
   */
  fetchFacet: PropTypes.func.isRequired,
  /**
   * Redux action for resetting a facet.
   */
  clearFacet: PropTypes.func.isRequired,
  /**
   * Redux action for displaying an error message.
   */
  showError: PropTypes.func.isRequired,
  /**
   * Redux action expanding and collapsing the header of perspective.
   */
  updatePerspectiveHeaderExpanded: PropTypes.func.isRequired,
  /**
   * Redux action for updating the bounds of a Leaflet map.
   */
  updateMapBounds: PropTypes.func.isRequired,
  /**
   * Redux action for loading translations from JavaScript objects.
   */
  loadLocales: PropTypes.func.isRequired,
  /**
   * Redux action for animating TemporalMap.
   */
  animateMap: PropTypes.func,
  /**
   * State for client-side faceted search.
   */
  clientFS: PropTypes.object,
  /**
   * Redux action for updating the dataset selections in client-side faceted search.
   */
  clientFSToggleDataset: PropTypes.func,
  /**
   * Redux action for the fetching the initial result set in client-side faceted search.
   */
  clientFSFetchResults: PropTypes.func,
  /**
   * Redux action for the clearing the initial result set in client-side faceted search.
   */
  clientFSClearResults: PropTypes.func,
  /**
   * Redux action for sorting results in client-side faceted search.
   */
  clientFSSortResults: PropTypes.func,
  /**
   * Redux action for updating the initial query in client-side faceted search.
   */
  clientFSUpdateQuery: PropTypes.func,
  /**
   * Redux action for updating a facet in client-side faceted search.
   */
  clientFSUpdateFacet: PropTypes.func
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SemanticPortal)
