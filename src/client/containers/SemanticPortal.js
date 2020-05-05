import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'
import classNames from 'classnames'
import compose from 'recompose/compose'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import 'moment/locale/fi'
import Grid from '@material-ui/core/Grid'

// ** General components **
import TopBar from '../components/main_layout/TopBar'
import InstanceHomePage from '../components/main_layout/InstanceHomePage'
import InfoHeader from '../components/main_layout/InfoHeader'
import TextPage from '../components/main_layout/TextPage'
import Message from '../components/main_layout/Message'
import Main from '../components/main_layout/Main'
import FacetBar from '../components/facet_bar/FacetBar'
// ** General components end **

// ** Portal specific components and configs **
import FacetedSearchPerspective from '../components/perspectives/sampo/FacetedSearchPerspective'
import FullTextSearch from '../components/perspectives/sampo/FullTextSearch'
import ClientFSPerspective from '../components/perspectives/sampo/client_fs/ClientFSPerspective'
import ClientFSMain from '../components/perspectives/sampo/client_fs/ClientFSMain'
import Footer from '../components/perspectives/sampo/Footer'
import { perspectiveConfig } from '../configs/sampo/PerspectiveConfig'
import { perspectiveConfigOnlyInfoPages } from '../configs/sampo/PerspectiveConfigOnlyInfoPages'
import { rootUrl } from '../configs/sampo/GeneralConfig'
// ** Portal specific components and configs end **

import {
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchFullTextResults,
  clearResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  sortResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSSortResults,
  clientFSClearResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet
} from '../actions'
import { filterResults } from '../selectors'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // Set app height for different screen sizes
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    /* Background color of the app.
       In order to use both 'auto' and '100%' heights, bg-color
       needs to be defined also in index.html (for #app and #root elements)
    */
    backgroundColor: '#bdbdbd'
  },
  flex: {
    flexGrow: 1
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  mainContainer: {
    height: 'auto',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 64px)' // 100% - app bar - padding
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 56 // app bar
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64 // app bar
    }
  },
  mainContainerClientFS: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 144px)' // 100% - app bar - padding * 2
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 56 // app bar
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 72 // app bar + padding
    }
  },
  textPageContainer: {
    width: '100%',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 80px)'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 64 // app bar + padding
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 72 // app bar + padding
    }
  },
  perspectiveContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 130px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 133 // app bar + header
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 130 // app bar + header
    }
  },
  perspectiveContainerHeaderExpanded: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 316px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 308 // app bar + header
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 316 // app bar + header
    }
  },
  // perspective container is divided into two columns:
  facetBarContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    overflow: 'auto',
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  },
  facetBarContainerClientFS: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    overflow: 'auto',
    // paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    paddingBottom: theme.spacing(1)
  },
  resultsContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1)
    }
  },
  resultsContainerClientFS: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1)
    }
  },
  instancePageContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 170px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 164
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 170
    }
  },
  instancePageContainerHeaderExpanded: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 354px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 348
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 354
    }
  },
  instancePageContent: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  }
}))

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
  const noResults = props.clientFS.results == null

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={props.options.currentLocale}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Message error={error} />
          <>
            <TopBar
              rootUrl={rootUrlWithLang}
              search={props.fullTextSearch}
              fetchFullTextResults={props.fetchFullTextResults}
              clearResults={props.clearResults}
              perspectives={perspectiveConfig}
              currentLocale={props.options.currentLocale}
              availableLocales={props.options.availableLocales}
              loadLocales={props.loadLocales}
              xsScreen={xsScreen}
              location={props.location}
            />
            <Route exact path={`${rootUrl}/`}>
              <Redirect to={rootUrlWithLang} />
            </Route>
            <Route
              exact path={`${rootUrlWithLang}/`}
              render={() =>
                <Grid container spacing={1} className={classes.mainContainer}>
                  <Main
                    perspectives={perspectiveConfig}
                    screenSize={screenSize}
                    rootUrl={rootUrlWithLang}
                  />
                  <Footer />
                </Grid>}
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
                <Grid container spacing={1} className={classes.mainContainer}>
                  <Grid item xs={12} className={classes.resultsContainer}>
                    <FullTextSearch
                      fullTextSearch={props.fullTextSearch}
                      routeProps={routeProps}
                      screenSize={screenSize}
                      rootUrl={rootUrlWithLang}
                    />
                  </Grid>
                </Grid>}
            />
            {/* routes for faceted search perspectives */}
            {perspectiveConfig.map(perspective => {
              if (!has(perspective, 'externalUrl') && perspective.id !== 'placesClientFS') {
                return (
                  <React.Fragment key={perspective.id}>
                    <Route
                      path={`${rootUrlWithLang}/${perspective.id}/faceted-search`}
                      render={routeProps => {
                        return (
                          <>
                            <InfoHeader
                              resultClass={perspective.id}
                              pageType='facetResults'
                              expanded={props[perspective.id].facetedSearchHeaderExpanded}
                              updateExpanded={props.updatePerspectiveHeaderExpanded}
                              descriptionHeight={perspective.perspectiveDescHeight}
                            />
                            <Grid
                              container spacing={1} className={props[perspective.id].facetedSearchHeaderExpanded
                                ? classes.perspectiveContainerHeaderExpanded
                                : classes.perspectiveContainer}
                            >
                              <Grid item xs={12} md={3} className={classes.facetBarContainer}>
                                <FacetBar
                                  facetedSearchMode='serverFS'
                                  facetData={props[`${perspective.id}Facets`]}
                                  facetDataConstrainSelf={has(props, `${perspective.id}FacetsConstrainSelf`)
                                    ? props[`${perspective.id}FacetsConstrainSelf`]
                                    : null}
                                  facetClass={perspective.id}
                                  resultClass={perspective.id}
                                  fetchingResultCount={props[perspective.id].fetchingResultCount}
                                  resultCount={props[perspective.id].resultCount}
                                  fetchFacet={props.fetchFacet}
                                  fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                                  fetchResultCount={props.fetchResultCount}
                                  updateFacetOption={props.updateFacetOption}
                                  defaultActiveFacets={perspective.defaultActiveFacets}
                                  rootUrl={rootUrlWithLang}
                                />
                              </Grid>
                              <Grid item xs={12} md={9} className={classes.resultsContainer}>
                                <FacetedSearchPerspective
                                  facetResults={props[`${perspective.id}`]}
                                  placesResults={props.places}
                                  facetData={props[`${perspective.id}Facets`]}
                                  leafletMap={props.leafletMap}
                                  fetchPaginatedResults={props.fetchPaginatedResults}
                                  fetchResults={props.fetchResults}
                                  fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                                  fetchByURI={props.fetchByURI}
                                  updatePage={props.updatePage}
                                  updateRowsPerPage={props.updateRowsPerPage}
                                  updateFacetOption={props.updateFacetOption}
                                  sortResults={props.sortResults}
                                  routeProps={routeProps}
                                  perspective={perspective}
                                  animationValue={props.animationValue}
                                  animateMap={props.animateMap}
                                  screenSize={screenSize}
                                  rootUrl={rootUrlWithLang}
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
                        to={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                      />
                      <Route
                        path={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                        render={routeProps => {
                          return (
                            <>
                              <InfoHeader
                                resultClass={perspective.id}
                                pageType='instancePage'
                                instanceData={props[perspective.id].instance}
                                expanded={props[perspective.id].instancePageHeaderExpanded}
                                updateExpanded={props.updatePerspectiveHeaderExpanded}
                                descriptionHeight={perspective.perspectiveDescHeight}
                              />
                              <Grid
                                container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                                  ? classes.instancePageContainerHeaderExpanded
                                  : classes.instancePageContainer}
                              >
                                <Grid item xs={12} className={classes.instancePageContent}>
                                  <InstanceHomePage
                                    rootUrl={rootUrlWithLang}
                                    fetchByURI={props.fetchByURI}
                                    resultClass={perspective.id}
                                    properties={props[perspective.id].properties}
                                    tabs={perspective.instancePageTabs}
                                    data={props[perspective.id].instance}
                                    sparqlQuery={props[perspective.id].instanceSparqlQuery}
                                    isLoading={props[perspective.id].fetching}
                                    routeProps={routeProps}
                                    screenSize={screenSize}
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
            })}
            {/* create routes for classes that have only info pages and no faceted search perspective */}
            {perspectiveConfigOnlyInfoPages.map(perspective =>
              <Switch key={perspective.id}>
                <Redirect
                  from={`/${perspective.id}/page/:id`}
                  to={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                />
                <Route
                  path={`/${perspective.id}/page/:id`}
                  render={routeProps => {
                    return (
                      <>
                        <InfoHeader
                          resultClass={perspective.id}
                          pageType='instancePage'
                          instanceData={props[perspective.id].instance}
                          expanded={props[perspective.id].instancePageHeaderExpanded}
                          updateExpanded={props.updatePerspectiveHeaderExpanded}
                          descriptionHeight={perspective.perspectiveDescHeight}
                        />
                        <Grid
                          container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                            ? classes.instancePageContainerHeaderExpanded
                            : classes.instancePageContainer}
                        >
                          <Grid item xs={12} className={classes.instancePageContent}>
                            <InstanceHomePage
                              rootUrl={rootUrlWithLang}
                              fetchByURI={props.fetchByURI}
                              resultClass={perspective.id}
                              properties={props[perspective.id].properties}
                              tabs={perspective.instancePageTabs}
                              data={props[perspective.id].instance}
                              sparqlQuery={props[perspective.id].instanceSparqlQuery}
                              isLoading={props[perspective.id].fetching}
                              routeProps={routeProps}
                              screenSize={screenSize}
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
              path={`${rootUrlWithLang}/clientFSPlaces/federated-search`}
              render={routeProps =>
                <Grid container className={classes.mainContainerClientFS}>
                  <Grid item sm={12} md={4} lg={3} className={classes.facetBarContainerClientFS}>
                    <FacetBar
                      facetedSearchMode='clientFS'
                      facetClass='clientFSPlaces'
                      resultClass='clientFSPlaces'
                      facetData={props.clientFS}
                      clientFSFacetValues={props.clientFSFacetValues}
                      fetchingResultCount={props.clientFS.textResultsFetching}
                      resultCount={noResults ? 0 : props.clientFS.results.length}
                      clientFS={props.clientFS}
                      clientFSToggleDataset={props.clientFSToggleDataset}
                      clientFSFetchResults={props.clientFSFetchResults}
                      clientFSClearResults={props.clientFSClearResults}
                      clientFSUpdateQuery={props.clientFSUpdateQuery}
                      clientFSUpdateFacet={props.clientFSUpdateFacet}
                      defaultActiveFacets={perspectiveConfig[3].defaultActiveFacets}
                      leafletMap={props.leafletMap}
                      updateMapBounds={props.updateMapBounds}
                      screenSize={screenSize}
                      showError={props.showError}
                      rootUrl={rootUrlWithLang}
                    />
                  </Grid>
                  <Grid item sm={12} md={8} lg={9} className={classes.resultsContainerClientFS}>
                    {noResults && <ClientFSMain />}
                    {!noResults &&
                      <ClientFSPerspective
                        routeProps={routeProps}
                        perspective={perspectiveConfig[3]}
                        screenSize={screenSize}
                        clientFS={props.clientFS}
                        clientFSResults={props.clientFSResults}
                        clientFSSortResults={props.clientFSSortResults}
                        leafletMap={props.leafletMap}
                        fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                        rootUrl={rootUrlWithLang}
                      />}
                  </Grid>
                </Grid>}
            />
            {/* create routes for info buttons */}
            <Route
              path={`${rootUrlWithLang}/feedback`}
              render={() =>
                <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                  <TextPage>{intl.getHTML('feedback')}</TextPage>
                </div>}
            />
            <Route
              path={`${rootUrlWithLang}/about`}
              render={() =>
                <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                  <TextPage>{intl.getHTML('aboutThePortal')}</TextPage>
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
      </div>
    </MuiPickersUtilsProvider>
  )
}

const mapStateToProps = state => {
  const { clientFSResults, clientFSFacetValues } = filterResults(state.clientSideFacetedSearch)
  return {
    perspective1: state.perspective1,
    perspective1Facets: state.perspective1Facets,
    perspective1FacetsConstrainSelf: state.perspective1FacetsConstrainSelf,
    perspective2: state.perspective2,
    perspective2Facets: state.perspective2Facets,
    perspective3: state.perspective3,
    perspective3Facets: state.perspective3Facets,
    places: state.places,
    leafletMap: state.leafletMap,
    fullTextSearch: state.fullTextSearch,
    clientFS: state.clientSideFacetedSearch,
    clientFSResults,
    clientFSFacetValues,
    animationValue: state.animation.value,
    options: state.options,
    error: state.error
  }
}

const mapDispatchToProps = ({
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchFullTextResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
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
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSClearResults,
  clientFSSortResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet
})

SemanticPortal.propTypes = {
  options: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  perspective1: PropTypes.object.isRequired,
  perspective1Facets: PropTypes.object.isRequired,
  perspective1FacetsConstrainSelf: PropTypes.object.isRequired,
  perspective2: PropTypes.object.isRequired,
  perspective2Facets: PropTypes.object.isRequired,
  perspective3: PropTypes.object.isRequired,
  perspective3Facets: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  leafletMap: PropTypes.object.isRequired,
  animationValue: PropTypes.array.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchResultCount: PropTypes.func.isRequired,
  fetchFullTextResults: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  updatePerspectiveHeaderExpanded: PropTypes.func.isRequired,
  updateMapBounds: PropTypes.func.isRequired,
  loadLocales: PropTypes.func.isRequired,
  animateMap: PropTypes.func.isRequired,
  clientFS: PropTypes.object,
  clientFSToggleDataset: PropTypes.func.isRequired,
  clientFSFetchResults: PropTypes.func.isRequired,
  clientFSClearResults: PropTypes.func.isRequired,
  clientFSSortResults: PropTypes.func.isRequired,
  clientFSUpdateQuery: PropTypes.func.isRequired,
  clientFSUpdateFacet: PropTypes.func.isRequired
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SemanticPortal)
