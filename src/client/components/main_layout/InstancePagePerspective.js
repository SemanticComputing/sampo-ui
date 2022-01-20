import React from 'react'
import InfoHeader from '../main_layout/InfoHeader'
import InstancePage from './InstancePage'
import Grid from '@mui/material/Grid'
import { getSpacing } from '../../helpers/helpers'
import { useLocation } from 'react-router-dom'

const InstancePagePerspective = props => {
  const {
    portalConfig, layoutConfig, perspective, perspectiveState,
    screenSize, rootUrl, apexChartsConfig, networkConfig,
    leafletConfig
  } = props
  const { instancePageHeaderExpanded } = perspectiveState
  return (
    <>
      <InfoHeader
        portalConfig={portalConfig}
        layoutConfig={layoutConfig}
        resultClass={perspective.id}
        pageType='instancePage'
        instanceData={perspectiveState.instanceTableData}
        expanded={instancePageHeaderExpanded}
        updateExpanded={props.updatePerspectiveHeaderExpanded}
        screenSize={screenSize}
      />
      <Grid
        container spacing={1}
        sx={theme => {
          if (instancePageHeaderExpanded) {
            return {
              margin: theme.spacing(0.5),
              width: `calc(100% - ${getSpacing(theme, 1)}px)`,
              [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
                    2 * layoutConfig.infoHeader.reducedHeight.height +
                    layoutConfig.infoHeader.reducedHeight.expandedContentHeight +
                    getSpacing(theme, 2.5)
                    }px)`
              },
              [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
                    2 * layoutConfig.infoHeader.default.height +
                    layoutConfig.infoHeader.default.expandedContentHeight +
                    getSpacing(theme, 1.5)
                    }px)`
              }
            }
          } else {
            return {
              margin: theme.spacing(0.5),
              width: `calc(100% - ${getSpacing(theme, 1)}px)`,
              [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.reducedHeight +
                    2 * layoutConfig.infoHeader.reducedHeight.height +
                    getSpacing(theme, 1.5)
                    }px)`
              },
              [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
                height: `calc(100% - ${layoutConfig.topBar.defaultHeight +
                    2 * layoutConfig.infoHeader.default.height +
                    getSpacing(theme, 0.5)
                    }px)`
              }
            }
          }
        }}
      >

        <Grid
          item xs={12}
          sx={theme => ({
            [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
              height: '100%'
            },
            padding: '0px !important'
          })}
        >
          <InstancePage
            portalConfig={portalConfig}
            layoutConfig={layoutConfig}
            perspectiveConfig={perspective}
            perspectiveState={perspectiveState}
            leafletMapState={props.leafletMapState}
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
            perspective={perspective}
            animationValue={props.animationValue}
            animateMap={props.animateMap}
            videoPlayerState={props.videoPlayer}
            updateVideoPlayerTime={props.updateVideoPlayerTime}
            screenSize={screenSize}
            rootUrl={rootUrl}
            apexChartsConfig={apexChartsConfig}
            leafletConfig={leafletConfig}
            networkConfig={networkConfig}
            location={useLocation()}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default InstancePagePerspective
