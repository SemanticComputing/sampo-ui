import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { withRouter, Route } from 'react-router-dom'
import classNames from 'classnames'
import compose from 'recompose/compose'
import Grid from '@material-ui/core/Grid'
import TopBar from '../components/main_layout/TopBar'
import Main from '../components/main_layout/Main'
import Footer from '../components/main_layout/Footer'
import Message from '../components/main_layout/Message'
import FacetBar from '../components/facet_bar/FacetBar'
import Perspective1 from '../components/perspectives/sampo/Perspective1'
import Perspective2 from '../components/perspectives/sampo/Perspective2'
import Perspective3 from '../components/perspectives/sampo/Perspective3'
import All from '../components/perspectives/mmm/All'
import InstanceHomePage from '../components/main_layout/InstanceHomePage'
import TextPage from '../components/main_layout/TextPage'
import { perspectiveConfig } from '../configs/sampo/PerspectiveConfig'
import { perspectiveConfigOnlyInfoPages } from '../configs/sampo/PerspectiveConfigOnlyInfoPages'
import InfoHeader from '../components/main_layout/InfoHeader'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { has } from 'lodash'
import {
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchResultsClientSide,
  clearResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  sortResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap
} from '../actions'

const styles = theme => ({
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
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 80px)' // 100% - app bar - padding
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 56 // app bar
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64 // app bar
    }
  },
  textPageContainer: {
    width: '100%',
    padding: theme.spacing(1)
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
})

const SemanticPortal = props => {
  const { classes, /* browser */ error } = props
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('xs'))

  const renderPerspective = (perspective, routeProps) => {
    let perspectiveElement = null
    switch (perspective.id) {
      case 'perspective1':
        perspectiveElement =
          <Perspective1
            perspective1={props.perspective1}
            places={props.places}
            facetData={props.perspective1Facets}
            fetchPaginatedResults={props.fetchPaginatedResults}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            updateFacetOption={props.updateFacetOption}
            sortResults={props.sortResults}
            routeProps={routeProps}
            perspective={perspective}
            animationValue={props.animationValue}
            animateMap={props.animateMap}
          />
        break
      case 'perspective2':
        perspectiveElement =
          <Perspective2
            perspective2={props.perspective2}
            places={props.places}
            facetData={props.perspective2Facets}
            fetchPaginatedResults={props.fetchPaginatedResults}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            sortResults={props.sortResults}
            routeProps={routeProps}
            perspective={perspective}
          />
        break
      case 'perspective3':
        perspectiveElement =
          <Perspective3
            perspective3={props.perspective3}
            places={props.places}
            facetData={props.perspective3Facets}
            fetchPaginatedResults={props.fetchPaginatedResults}
            fetchResults={props.fetchResults}
            fetchByURI={props.fetchByURI}
            updatePage={props.updatePage}
            updateRowsPerPage={props.updateRowsPerPage}
            updateFacetOption={props.updateFacetOption}
            sortResults={props.sortResults}
            routeProps={routeProps}
            perspective={perspective}
          />
        break
      default:
        perspectiveElement = <div />
        break
    }
    return perspectiveElement
  }
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <Message error={error} />
        <>
          <TopBar
            search={props.clientSideFacetedSearch}
            fetchResultsClientSide={props.fetchResultsClientSide}
            clearResults={props.clearResults}
            perspectives={perspectiveConfig}
            currentLocale={props.options.currentLocale}
            availableLocales={props.options.availableLocales}
            loadLocales={props.loadLocales}
            xsScreen={xsScreen}
          />
          <Route
            exact path='/'
            render={() =>
              <Grid container spacing={1} className={classes.mainContainer}>
                <Main perspectives={perspectiveConfig} />
                <Footer />
              </Grid>}
          />
          {/* route for full text search results */}
          <Route
            path='/all'
            render={routeProps =>
              <Grid container spacing={1} className={classes.mainContainer}>
                <Grid item xs={12} className={classes.resultsContainer}>
                  <All
                    clientSideFacetedSearch={props.clientSideFacetedSearch}
                    routeProps={routeProps}
                  />
                </Grid>
              </Grid>}
          />
          {/* routes for perspectives that don't have an external url */}
          {perspectiveConfig.map(perspective => {
            if (!has(perspective, 'externalUrl')) {
              return (
                <React.Fragment key={perspective.id}>
                  <Route
                    path={`/${perspective.id}/faceted-search`}
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
                              />
                            </Grid>
                            <Grid item xs={12} md={9} className={classes.resultsContainer}>
                              {renderPerspective(perspective, routeProps)}
                            </Grid>
                          </Grid>
                        </>
                      )
                    }}
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
                                fetchByURI={props.fetchByURI}
                                resultClass={perspective.id}
                                properties={props[perspective.id].properties}
                                tabs={perspective.instancePageTabs}
                                data={props[perspective.id].instance}
                                sparqlQuery={props[perspective.id].instanceSparqlQuery}
                                isLoading={props[perspective.id].fetching}
                                routeProps={routeProps}
                              />
                            </Grid>
                          </Grid>
                        </>
                      )
                    }}
                  />
                </React.Fragment>
              )
            }
          })}
          {/* create routes for classes that have only info pages and no perspective */}
          {perspectiveConfigOnlyInfoPages.map(perspective =>
            <Route
              key={perspective.id}
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
                          fetchByURI={props.fetchByURI}
                          resultClass={perspective.id}
                          properties={props[perspective.id].properties}
                          tabs={perspective.instancePageTabs}
                          data={props[perspective.id].instance}
                          sparqlQuery={props[perspective.id].instanceSparqlQuery}
                          isLoading={props[perspective.id].fetching}
                          routeProps={routeProps}
                        />
                      </Grid>
                    </Grid>
                  </>
                )
              }}
            />
          )}
          {/* create routes for info buttons */}
          <Route
            path='/feedback'
            render={() =>
              <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                <TextPage>{intl.getHTML('feedback')}</TextPage>
              </div>}
          />
          <Route
            path='/about'
            render={() =>
              <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                <TextPage>{intl.getHTML('aboutThePortal')}</TextPage>
              </div>}
          />
          <Route
            path='/instructions'
            render={() =>
              <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                <TextPage>{intl.getHTML('instructions')}</TextPage>
              </div>}
          />
        </>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    perspective1: state.perspective1,
    perspective1Facets: state.perspective1Facets,
    perspective2: state.perspective2,
    perspective2Facets: state.perspective2Facets,
    perspective3: state.perspective3,
    perspective3Facets: state.perspective3Facets,
    places: state.places,
    clientSideFacetedSearch: state.clientSideFacetedSearch,
    animationValue: state.animation.value,
    options: state.options,
    error: state.error
  }
}

const mapDispatchToProps = ({
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchResultsClientSide,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  sortResults,
  clearResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap
})

SemanticPortal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  perspective1: PropTypes.object.isRequired,
  perspective1Facets: PropTypes.object.isRequired,
  perspective2: PropTypes.object.isRequired,
  perspective2Facets: PropTypes.object.isRequired,
  perspective3: PropTypes.object.isRequired,
  perspective3Facets: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  animationValue: PropTypes.array.isRequired,
  fetchResults: PropTypes.func.isRequired,
  fetchResultCount: PropTypes.func.isRequired,
  fetchResultsClientSide: PropTypes.func.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  updatePerspectiveHeaderExpanded: PropTypes.func.isRequired,
  loadLocales: PropTypes.func.isRequired,
  animateMap: PropTypes.func.isRequired,
  clientSideFacetedSearch: PropTypes.object.isRequired
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withWidth(),
  withStyles(styles, { withTheme: true })
)(SemanticPortal)
