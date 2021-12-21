import React, { useEffect, lazy } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'
import classNames from 'classnames'
import { compose } from '@shakacode/recompose'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import 'moment/locale/fi'
import Grid from '@material-ui/core/Grid'
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
  createPerspectiveConfigOnlyInfoPages
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
  layoutConfig
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
const InfoHeader = lazy(() => import('../components/main_layout/InfoHeader'))
const TextPage = lazy(() => import('../components/main_layout/TextPage'))
const Message = lazy(() => import('../components/main_layout/Message'))
const InstancePage = lazy(() => import('../components/main_layout/InstancePage'))
const FullTextSearch = lazy(() => import('../components/main_layout/FullTextSearch'))
const FacetBar = lazy(() => import('../components/facet_bar/FacetBar'))
const FacetResults = lazy(() => import('../components/facet_results/FacetResults'))
const FederatedResults = lazy(() => import('../components/facet_results/FederatedResults'))
const KnowledgeGraphMetadataTable = lazy(() => import('../components/main_layout/KnowledgeGraphMetadataTable'))
// ** General components end **

// ** Import portal specific components **
const Main = lazy(() => import(`../components/perspectives/${portalID}/Main`))
const MainClientFS = lazy(() => import(`../components/perspectives/${portalID}/MainClientFS`))
const Footer = lazy(() => import(`../components/perspectives/${portalID}/Footer`))
// ** Portal specific components end **

const useStyles = makeStyles(theme => ({
  root: {
    /* Background color of the app.
       In order to use both 'auto' and '100%' heights, bg-color
       needs to be defined also in index.html (for #app and #root elements)
    */
    backgroundColor: '#bdbdbd',
    overflowX: 'hidden',
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      overflow: 'hidden',
      height: '100%'
    }
  },
  mainContainerClientFS: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.reducedHeight + layoutConfig.footer.reducedHeight + theme.spacing(1)}px)`
    },
    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.defaultHeight + layoutConfig.footer.defaultHeight + theme.spacing(1)}px)`
    }
  },
  textPageContainer: {
    margin: theme.spacing(0.5),
    width: `calc(100% - ${theme.spacing(1)}px)`,
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.reducedHeight + theme.spacing(1.5)}px)`
    },
    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.defaultHeight + theme.spacing(1.5)}px)`
    }
  },
  perspectiveContainer: {
    margin: theme.spacing(0.5),
    width: `calc(100% - ${theme.spacing(1)}px)`,
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.reducedHeight + layoutConfig.infoHeader.reducedHeight.height + theme.spacing(1.5)}px)`
    },
    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.defaultHeight + layoutConfig.infoHeader.default.height + theme.spacing(1.5)}px)`
    }
  },
  perspectiveContainerHeaderExpanded: {
    margin: theme.spacing(0.5),
    width: `calc(100% - ${theme.spacing(1)}px)`,
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
        layoutConfig.infoHeader.reducedHeight.height +
        layoutConfig.infoHeader.reducedHeight.expandedContentHeight +
        theme.spacing(3.5)
        }px)`
    },
    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
        layoutConfig.infoHeader.default.height +
        layoutConfig.infoHeader.default.expandedContentHeight +
        theme.spacing(3.5)
        }px)`
    }
  },
  // perspective container is divided into two columns:
  facetBarContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    [theme.breakpoints.down('sm')]: {
      paddingRight: '0px !important'
    },
    overflow: 'auto',
    paddingLeft: '0px !important',
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  },
  facetBarContainerClientFS: {
    overflow: 'auto',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '100%'
    }
  },
  resultsContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    paddingRight: '0px !important',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '0px !important',
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(0.5)
    }
  },
  resultsContainerClientFS: {
    minHeight: 500,
    paddingBottom: '0px !important',
    paddingRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '100%',
      marginTop: 0
    }
  },
  instancePageContainer: {
    margin: theme.spacing(0.5),
    width: `calc(100% - ${theme.spacing(1)}px)`,
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.reducedHeight + 2 * layoutConfig.infoHeader.reducedHeight.height + theme.spacing(1.5)}px)`
    },
    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.defaultHeight + 89 + theme.spacing(1.5)}px)`
    }
  },
  instancePageContainerHeaderExpanded: {
    margin: theme.spacing(0.5),
    width: `calc(100% - ${theme.spacing(1)}px)`,
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
        2 * layoutConfig.infoHeader.reducedHeight.height +
        layoutConfig.infoHeader.reducedHeight.expandedContentHeight +
        theme.spacing(3.5)
        }px)`
    },
    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
      height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
        89 +
        layoutConfig.infoHeader.default.expandedContentHeight +
        theme.spacing(3.5)
        }px)`
    }
  },
  instancePageContent: {
    [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '100%'
    },
    padding: '0px !important'
  }
}))

/**
 * A top-level container component, which connects all Sampo-UI components to the Redux store. Also
 * the main routes of the portal are defined here using React Router. Currently it is not possible to
 * render this component in Storybook.
 */
const SemanticPortal = props => {
  const { error } = props
  const classes = useStyles(props)
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('xs'))
  const smScreen = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'))
  const mdScreen = useMediaQuery(theme => theme.breakpoints.between('md', 'lg'))
  const lgScreen = useMediaQuery(theme => theme.breakpoints.between('lg', 'xl'))
  const xlScreen = useMediaQuery(theme => theme.breakpoints.up('xl'))
  let screenSize = ''
  if (xsScreen) { screenSize = 'xs' }
  if (smScreen) { screenSize = 'sm' }
  if (mdScreen) { screenSize = 'md' }
  if (lgScreen) { screenSize = 'lg' }
  if (xlScreen) { screenSize = 'xl' }
  const rootUrlWithLang = `${rootUrl}/${props.options.currentLocale}`
  const noClientFSResults = props.clientFSState && props.clientFSState.results === null

  useEffect(() => {
    document.title = intl.get('html.title')
    document.documentElement.lang = props.options.currentLocale
    document.querySelector('meta[name="description"]').setAttribute('content', intl.get('html.description'))
  }, [props.options.currentLocale])

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={props.options.currentLocale}>
      <div className={classes.root}>
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
            xsScreen={xsScreen}
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
                    render={routeProps => {
                      return (
                        <>
                          <InfoHeader
                            portalConfig={portalConfig}
                            layoutConfig={layoutConfig}
                            resultClass={perspective.id}
                            pageType='facetResults'
                            expanded={props[perspective.id].facetedSearchHeaderExpanded}
                            updateExpanded={props.updatePerspectiveHeaderExpanded}
                            screenSize={screenSize}
                          />
                          <Grid
                            container spacing={1} className={props[perspective.id].facetedSearchHeaderExpanded
                              ? classes.perspectiveContainerHeaderExpanded
                              : classes.perspectiveContainer}
                          >
                            <Grid item xs={12} md={3} className={classes.facetBarContainer}>
                              <FacetBar
                                portalConfig={portalConfig}
                                layoutConfig={layoutConfig}
                                facetedSearchMode='serverFS'
                                facetData={props[`${perspective.id}Facets`]}
                                facetDataConstrainSelf={props[`${perspective.id}FacetsConstrainSelf`]}
                                facetResults={props[`${perspective.id}`]}
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
                              />
                            </Grid>
                            <Grid item xs={12} md={9} className={classes.resultsContainer}>
                              <FacetResults
                                portalConfig={portalConfig}
                                layoutConfig={layoutConfig}
                                perspectiveConfig={perspective}
                                perspectiveState={props[`${perspective.id}`]}
                                facetState={props[`${perspective.id}Facets`]}
                                facetConstrainSelfState={props[`${perspective.id}FacetsConstrainSelf`]}
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
                                screenSize={screenSize}
                                rootUrl={rootUrlWithLang}
                                apexChartsConfig={apexChartsConfig}
                                leafletConfig={leafletConfig}
                                networkConfig={networkConfig}
                              />
                            </Grid>
                          </Grid>
                        </>
                      )
                    }}
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
                      render={routeProps => {
                        return (
                          <>
                            <InfoHeader
                              portalConfig={portalConfig}
                              layoutConfig={layoutConfig}
                              resultClass={perspective.id}
                              pageType='instancePage'
                              instanceData={props[perspective.id].instanceTableData}
                              expanded={props[perspective.id].instancePageHeaderExpanded}
                              updateExpanded={props.updatePerspectiveHeaderExpanded}
                              screenSize={screenSize}
                            />
                            <Grid
                              container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                                ? classes.instancePageContainerHeaderExpanded
                                : classes.instancePageContainer}
                            >
                              <Grid item xs={12} className={classes.instancePageContent}>
                                <InstancePage
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
                                />
                              </Grid>
                            </Grid>
                          </>
                        )
                      }}
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
                render={routeProps => {
                  return (
                    <>
                      <InfoHeader
                        portalConfig={portalConfig}
                        layoutConfig={layoutConfig}
                        resultClass={perspective.id}
                        pageType='instancePage'
                        instanceData={props[perspective.id].instanceTableData}
                        expanded={props[perspective.id].instancePageHeaderExpanded}
                        updateExpanded={props.updatePerspectiveHeaderExpanded}
                        screenSize={screenSize}
                      />
                      <Grid
                        container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                          ? classes.instancePageContainerHeaderExpanded
                          : classes.instancePageContainer}
                      >
                        <Grid item xs={12} className={classes.instancePageContent}>
                          <InstancePage
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
                          />
                        </Grid>
                      </Grid>
                    </>
                  )
                }}
              />
            </Switch>
          )}
          <Route
            path={`${rootUrlWithLang}/perspective4/federated-search`}
            render={routeProps =>
              <>
                <Grid container className={classes.mainContainerClientFS}>
                  <Grid item sm={12} md={4} lg={3} className={classes.facetBarContainerClientFS}>
                    <FacetBar
                      portalConfig={portalConfig}
                      layoutConfig={layoutConfig}
                      facetedSearchMode='clientFS'
                      facetClass='perspective4'
                      resultClass='perspective4'
                      facetData={props.clientFSState}
                      clientFSFacetValues={props.clientFSFacetValues}
                      fetchingResultCount={props.clientFSState.textResultsFetching}
                      resultCount={noClientFSResults ? 0 : props.clientFSState.results.length}
                      clientFSState={props.clientFSState}
                      clientFSToggleDataset={props.clientFSToggleDataset}
                      clientFSFetchResults={props.clientFSFetchResults}
                      clientFSClearResults={props.clientFSClearResults}
                      clientFSUpdateQuery={props.clientFSUpdateQuery}
                      clientFSUpdateFacet={props.clientFSUpdateFacet}
                      defaultActiveFacets={perspectiveConfig.find(p => p.id === 'perspective4').defaultActiveFacets}
                      leafletMap={props.leafletMap}
                      updateMapBounds={props.updateMapBounds}
                      screenSize={screenSize}
                      showError={props.showError}
                      rootUrl={rootUrlWithLang}
                      apexChartsConfig={apexChartsConfig}
                      leafletConfig={leafletConfig}
                      networkConfig={networkConfig}
                    />
                  </Grid>
                  <Grid item sm={12} md={8} lg={9} className={classes.resultsContainerClientFS}>
                    {noClientFSResults && <MainClientFS />}
                    {!noClientFSResults &&
                      <FederatedResults
                        portalConfig={portalConfig}
                        layoutConfig={layoutConfig}
                        perspective={perspectiveConfig.find(p => p.id === 'perspective4')}
                        routeProps={routeProps}
                        screenSize={screenSize}
                        clientFSState={props.clientFSState}
                        clientFSResults={props.clientFSResults}
                        clientFSSortResults={props.clientFSSortResults}
                        leafletMap={props.leafletMap}
                        updateMapBounds={props.updateMapBounds}
                        fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                        fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                        clearGeoJSONLayers={props.clearGeoJSONLayers}
                        showError={props.showError}
                        rootUrl={rootUrlWithLang}
                        apexChartsConfig={apexChartsConfig}
                        leafletConfig={leafletConfig}
                        networkConfig={networkConfig}
                      />}
                  </Grid>
                </Grid>
                <Footer
                  portalConfig={portalConfig}
                  layoutConfig={layoutConfig}
                />
              </>}

          />
          {/* create routes for info buttons */}
          <Route
            path={`${rootUrlWithLang}/about`}
            render={() =>
              <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                <TextPage>
                  {intl.getHTML('aboutThePortalPartOne')}
                  <KnowledgeGraphMetadataTable
                    portalConfig={portalConfig}
                    layoutConfig={layoutConfig}
                    perspectiveID='perspective1'
                    resultClass='perspective1KnowledgeGraphMetadata'
                    fetchKnowledgeGraphMetadata={props.fetchKnowledgeGraphMetadata}
                    knowledgeGraphMetadata={props.perspective1.knowledgeGraphMetadata}
                  />
                  {intl.getHTML('aboutThePortalPartTwo')}
                </TextPage>
              </div>}
          />
          <Route
            path={`${rootUrlWithLang}/instructions`}
            render={() =>
              <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                <TextPage>{intl.getHTML('instructions')}</TextPage>
              </div>}
          />
        </>
      </div>
    </MuiPickersUtilsProvider>
  )
}

const mapStateToProps = state => {
  const stateToProps = {}
  perspectiveConfig.forEach(perspective => {
    const { id, searchMode } = perspective
    if (searchMode && searchMode === 'federated-search') {
      const { clientFSResults, clientFSFacetValues } = filterResults(state[id])
      stateToProps.clientFSState = state[id]
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

export const SemanticPortalComponent = SemanticPortal

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SemanticPortal)
