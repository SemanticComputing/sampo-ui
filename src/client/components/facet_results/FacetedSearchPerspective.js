import React from 'react'
import InfoHeader from '../main_layout/InfoHeader'
import FacetBar from '../facet_bar/FacetBar'
import FacetResults from './FacetResults'
import Grid from '@mui/material/Grid'
import { getSpacing } from '../../helpers/helpers'

const FacetedSearchPerspective = props => {
  const {
    portalConfig, layoutConfig, perspective, perspectiveState, facetState,
    facetStateConstrainSelf, screenSize, rootUrl, apexChartsConfig, networkConfig,
    leafletConfig, routeProps
  } = props
  const { facetedSearchHeaderExpanded } = perspectiveState
  return (
    <>
      <InfoHeader
        portalConfig={portalConfig}
        layoutConfig={layoutConfig}
        resultClass={perspective.id}
        pageType='facetResults'
        expanded={facetedSearchHeaderExpanded}
        updateExpanded={props.updatePerspectiveHeaderExpanded}
        screenSize={screenSize}
      />
      <Grid
        container spacing={1}
        sx={theme => {
          if (facetedSearchHeaderExpanded) {
            return {
              margin: theme.spacing(0.5),
              width: `calc(100% - ${getSpacing(theme, 1)}px)`,
              [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
                    layoutConfig.infoHeader.reducedHeight.height +
                    layoutConfig.infoHeader.reducedHeight.expandedContentHeight +
                    getSpacing(theme, 3.5)
                    }px)`
              },
              [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
                    layoutConfig.infoHeader.default.height +
                    layoutConfig.infoHeader.default.expandedContentHeight +
                    getSpacing(theme, 3.5)
                    }px)`
              }
            }
          } else {
            return {
              margin: theme.spacing(0.5),
              width: `calc(100% - ${getSpacing(theme, 1)}px)`,
              [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
                    layoutConfig.infoHeader.reducedHeight.height +
                    getSpacing(theme, 1.5)
                    }px)`
              },
              [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
                    layoutConfig.infoHeader.default.height +
                    getSpacing(theme, 1.5)
                    }px)`
              }
            }
          }
        }}
      >
        <Grid
          item xs={12} md={3}
          sx={theme => ({
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
          })}
        >
          <FacetBar
            portalConfig={portalConfig}
            perspectiveConfig={perspective}
            layoutConfig={layoutConfig}
            facetedSearchMode='serverFS'
            facetState={facetState}
            facetStateConstrainSelf={facetStateConstrainSelf}
            perspectiveState={perspectiveState}
            facetClass={perspective.id}
            resultClass={perspective.id}
            fetchingResultCount={perspectiveState.fetchingResultCount}
            resultCount={perspectiveState.resultCount}
            fetchFacet={props.fetchFacet}
            fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
            fetchResults={props.fetchResults}
            clearFacet={props.clearFacet}
            clearAllFacets={props.clearAllFacets}
            fetchResultCount={props.fetchResultCount}
            updateFacetOption={props.updateFacetOption}
            showError={props.showError}
            defaultActiveFacets={perspective.defaultActiveFacets}
            rootUrl={rootUrl}
            screenSize={screenSize}
            apexChartsConfig={apexChartsConfig}
            leafletConfig={leafletConfig}
            networkConfig={networkConfig}
          />
        </Grid>
        <Grid
          item xs={12} md={9}
          sx={theme => ({
            height: 'auto',
            [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
              height: `calc(100% - ${getSpacing(theme, 0.5)}px)`
            },
            paddingTop: '0px !important',
            paddingBottom: '0px !important',
            paddingRight: '0px !important',
            [theme.breakpoints.down('sm')]: {
              paddingLeft: '0px !important',
              marginBottom: theme.spacing(1),
              marginTop: theme.spacing(0.5)
            }
          })}
        >
          <FacetResults
            portalConfig={portalConfig}
            layoutConfig={layoutConfig}
            perspectiveConfig={perspective}
            perspectiveState={perspectiveState}
            facetState={facetState}
            facetStateConstrainSelf={facetStateConstrainSelf}
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
            rootUrl={rootUrl}
            apexChartsConfig={apexChartsConfig}
            leafletConfig={leafletConfig}
            networkConfig={networkConfig}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default FacetedSearchPerspective
