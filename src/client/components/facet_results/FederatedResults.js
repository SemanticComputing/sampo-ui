import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import intl from 'react-intl-universal'
import { Route, Redirect } from 'react-router-dom'
import { groupBy, orderBy } from 'lodash'
import PerspectiveTabs from '../main_layout/PerspectiveTabs'
import LeafletMap from './LeafletMap'
import ResultInfo from './ResultInfo'
import VirtualizedTable from './VirtualizedTable'
import ApexCharts from './ApexCharts'
import CSVButton from './CSVButton'

const FederatedResults = props => {
  const { rootUrl, perspective, screenSize, clientFSState, layoutConfig, portalConfig } = props
  const { searchMode } = perspective
  const perspectiveID = perspective.id
  const { maps } = clientFSState
  const { mapClusters, mapMarkers } = maps
  const layerControlExpanded = screenSize === 'md' ||
    screenSize === 'lg' ||
    screenSize === 'xl'
  let groupedResults = []
  if (props.location.pathname.endsWith('statistics')) {
    const grouped = groupBy(props.clientFSResults, clientFSState.groupBy)
    for (const key in grouped) {
      groupedResults.push({
        category: key,
        prefLabel: key,
        instanceCount: grouped[key].length
      })
    }
    groupedResults = orderBy(groupedResults, 'instanceCount', 'desc')
  }
  return (
    <>
      <PerspectiveTabs
        tabs={perspective.tabs}
        screenSize={props.screenSize}
        layoutConfig={layoutConfig}
      />
      <Route
        exact path={`${rootUrl}/${perspectiveID}/${searchMode}`}
        render={() => <Redirect to={`${rootUrl}/${perspectiveID}/${searchMode}/table`} />}
      />
      <Route path={`${rootUrl}/${perspectiveID}/${searchMode}/table`}>
        <VirtualizedTable
          portalConfig={portalConfig}
          list={Immutable.List(props.clientFSResults)}
          clientFSState={props.clientFSState}
          clientFSSortResults={props.clientFSSortResults}
          perspectiveID={perspectiveID}
          layoutConfig={layoutConfig}
        />
      </Route>
      <Route path={`${rootUrl}/${perspectiveID}/${searchMode}/map_clusters`}>
        <LeafletMap
          portalConfig={portalConfig}
          perspectiveConfig={perspective}
          center={mapClusters.center}
          zoom={mapClusters.zoom}
          results={props.clientFSResults}
          leafletMapState={props.leafletMapState}
          resultClass='mapClusters'
          pageType='clientFSResults'
          mapMode='cluster'
          createPopUpContent={props.leafletConfig.createPopUpContentNameSampo}
          fetchResults={props.fetchResults}
          fetchGeoJSONLayers={props.fetchGeoJSONLayers}
          clearGeoJSONLayers={props.clearGeoJSONLayers}
          fetchByURI={props.fetchByURI}
          fetching={false}
          showInstanceCountInClusters={false}
          updateFacetOption={props.updateFacetOption}
          showError={props.showError}
          showExternalLayers
          layerControlExpanded={layerControlExpanded}
          layerConfigs={props.leafletConfig.layerConfigs}
          updateMapBounds={props.updateMapBounds}
          layoutConfig={layoutConfig}
        />
      </Route>
      <Route path={`${rootUrl}/${perspectiveID}/${searchMode}/map_markers`}>
        {props.clientFSResults.length < 500
          ? (
            <LeafletMap
              portalConfig={portalConfig}
              perspectiveConfig={perspective}
              center={mapMarkers.center}
              zoom={mapMarkers.zoom}
              results={props.clientFSResults}
              leafletMapState={props.leafletMapState}
              resultClass='mapMarkers'
              pageType='clientFSResults'
              mapMode='marker'
              createPopUpContent={props.leafletConfig.createPopUpContentNameSampo}
              fetchResults={props.fetchResults}
              fetchGeoJSONLayers={props.fetchGeoJSONLayers}
              clearGeoJSONLayers={props.clearGeoJSONLayers}
              fetchByURI={props.fetchByURI}
              fetching={false}
              showInstanceCountInClusters={false}
              updateFacetOption={props.updateFacetOption}
              showError={props.showError}
              showExternalLayers
              layerControlExpanded={layerControlExpanded}
              layerConfigs={props.leafletConfig.layerConfigs}
              updateMapBounds={props.updateMapBounds}
              layoutConfig={layoutConfig}
            />
            )
          : <ResultInfo message={intl.get('leafletMap.tooManyResults')} />}
      </Route>
      <Route path={`${rootUrl}/${perspectiveID}/${searchMode}/statistics`}>
        <ApexCharts
          portalConfig={portalConfig}
          layoutConfig={layoutConfig}
          perspectiveConfig={props.perspectiveConfig}
          apexChartsConfig={props.apexChartsConfig}
          results={groupedResults}
          pageType='clientFSResults'
          facetUpdateID={props.clientFSState.facetUpdateID}
          resultClassConfig={{
            createChartData: 'createApexPieChartData',
            property: props.clientFSState.groupBy,
            title: {
              text: props.clientFSState.groupByLabel,
              align: 'left'
            }
          }}
        />
      </Route>
      <Route path={`${rootUrl}/${perspectiveID}/${searchMode}/download`}>
        <CSVButton
          results={props.clientFSResults}
          layoutConfig={layoutConfig}
          portalConfig={portalConfig}
        />
      </Route>

    </>
  )
}

FederatedResults.propTypes = {
  perspective: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  clientFSState: PropTypes.object.isRequired,
  clientFSResults: PropTypes.array,
  clientFSSortResults: PropTypes.func.isRequired,
  leafletMapState: PropTypes.object.isRequired,
  updateMapBounds: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func,
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  clearGeoJSONLayers: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FederatedResults
