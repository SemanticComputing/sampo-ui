import React, { lazy } from 'react'
import FacetBar from '../facet_bar/FacetBar'
import FederatedResults from './FederatedResults'
import Grid from '@mui/material/Grid'
import { getSpacing } from '../../helpers/helpers'

const FederatedSearchPerspective = props => {
  const {
    portalConfig, layoutConfig, perspective,
    screenSize, rootUrl, apexChartsConfig, networkConfig,
    leafletConfig
  } = props
  const perspectiveID = perspective.id

  const MainClientFS = lazy(() => import(`../../components/perspectives/${portalConfig.portalID}/MainClientFS`))

  return (
    <Grid
      container spacing={1}
      sx={theme => {
        return {
          margin: theme.spacing(0.5),
          width: `calc(100% - ${getSpacing(theme, 1)}px)`,
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
        }
      }}
    >
      <Grid
        item sm={12} md={4}
        sx={theme => ({
          [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
            height: '100%'
          },
          [theme.breakpoints.down('md')]: {
            width: '100%',
            paddingRight: '0px !important',
            overflow: 'hidden'
          },
          overflow: 'auto',
          paddingLeft: '0px !important',
          paddingRight: '4px !important',
          paddingTop: '0px !important',
          paddingBottom: '0px !important'
        })}
      >
        <FacetBar
          portalConfig={portalConfig}
          perspectiveConfig={perspective}
          layoutConfig={layoutConfig}
          facetedSearchMode='clientFS'
          facetClass={perspectiveID}
          resultClass={perspectiveID}
          facetState={props.clientFSState}
          clientFSFacetValues={props.clientFSFacetValues}
          fetchingResultCount={props.clientFSState.textResultsFetching}
          resultCount={props.resultCount}
          clientFSState={props.clientFSState}
          clientFSToggleDataset={props.clientFSToggleDataset}
          clientFSFetchResults={props.clientFSFetchResults}
          clientFSClearResults={props.clientFSClearResults}
          clientFSUpdateQuery={props.clientFSUpdateQuery}
          clientFSUpdateFacet={props.clientFSUpdateFacet}
          defaultActiveFacets={props.defaultActiveFacets}
          leafletMapState={props.leafletMapState}
          updateMapBounds={props.updateMapBounds}
          screenSize={screenSize}
          showError={props.showError}
          rootUrl={rootUrl}
          apexChartsConfig={apexChartsConfig}
          leafletConfig={leafletConfig}
          networkConfig={networkConfig}
        />
      </Grid>
      <Grid
        item xs={12} md={8}
        sx={theme => ({
          height: 'auto',
          [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
            height: `calc(100% - ${getSpacing(theme, 0.5)}px)`
          },
          paddingTop: '0px !important',
          paddingBottom: '0px !important',
          paddingLeft: '4px !important',
          paddingRight: '0px !important',
          [theme.breakpoints.down('md')]: {
            paddingLeft: '0px !important',
            paddingRight: '0px !important',
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(0.5)
          }
        })}
      >
        {props.noClientFSResults && <MainClientFS />}
        {!props.noClientFSResults &&
          <FederatedResults
            portalConfig={portalConfig}
            layoutConfig={layoutConfig}
            perspective={perspective}
            screenSize={screenSize}
            clientFSState={props.clientFSState}
            clientFSResults={props.clientFSResults}
            clientFSSortResults={props.clientFSSortResults}
            leafletMapState={props.leafletMapState}
            updateMapBounds={props.updateMapBounds}
            fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
            fetchGeoJSONLayers={props.fetchGeoJSONLayers}
            clearGeoJSONLayers={props.clearGeoJSONLayers}
            showError={props.showError}
            rootUrl={rootUrl}
            location={props.location}
            apexChartsConfig={apexChartsConfig}
            leafletConfig={leafletConfig}
            networkConfig={networkConfig}
          />}
      </Grid>
    </Grid>

  )
}

export default FederatedSearchPerspective
