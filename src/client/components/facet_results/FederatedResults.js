import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import intl from 'react-intl-universal'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../main_layout/PerspectiveTabs'
import LeafletMap from './LeafletMap'
import ResultInfo from './ResultInfo'
import VirtualizedTable from './VirtualizedTable'
import Pie from './Pie.js'
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
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={perspective.tabs}
        screenSize={props.screenSize}
        layoutConfig={layoutConfig}
      />
      <Route
        exact path={`${rootUrl}/${perspectiveID}/${searchMode}`}
        render={() => <Redirect to={`${rootUrl}/${perspectiveID}/${searchMode}/table`} />}
      />
      <Route
        path={`${rootUrl}/${perspectiveID}/${searchMode}/table`}
        render={() =>
          <VirtualizedTable
            portalConfig={portalConfig}
            list={Immutable.List(props.clientFSResults)}
            clientFSState={props.clientFSState}
            clientFSSortResults={props.clientFSSortResults}
            perspectiveID={perspectiveID}
            layoutConfig={layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspectiveID}/${searchMode}/map_clusters`}
        render={() =>
          <LeafletMap
            portalConfig={portalConfig}
            center={mapClusters.center}
            zoom={mapClusters.zoom}
            results={props.clientFSResults}
            leafletMapState={props.leafletMap}
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
          />}
      />
      <Route
        path={`${rootUrl}/${perspectiveID}/${searchMode}/map_markers`}
        render={() => {
          if (props.clientFSResults.length > 500) {
            return <ResultInfo message={intl.get('leafletMap.tooManyResults')} />
          } else {
            return (
              <LeafletMap
                portalConfig={portalConfig}
                center={mapMarkers.center}
                zoom={mapMarkers.zoom}
                results={props.clientFSResults}
                leafletMapState={props.leafletMap}
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
          }
        }}
      />
      <Route
        path={`${rootUrl}/${perspectiveID}/${searchMode}/statistics`}
        render={() =>
          <Pie
            portalConfig={portalConfig}
            data={props.clientFSResults}
            groupBy={props.clientFSState.groupBy}
            groupByLabel={props.clientFSState.groupByLabel}
            query={props.clientFSState.query}
            layoutConfig={layoutConfig}
          />}
      />
      <Route
        path={`${rootUrl}/${perspectiveID}/${searchMode}/download`}
        render={() =>
          <CSVButton
            results={props.clientFSResults}
            layoutConfig={layoutConfig}
            portalConfig={portalConfig}
          />}
      />
    </>
  )
}

FederatedResults.propTypes = {
  routeProps: PropTypes.object.isRequired,
  perspective: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  clientFSState: PropTypes.object.isRequired,
  clientFSResults: PropTypes.array,
  clientFSSortResults: PropTypes.func.isRequired,
  leafletMap: PropTypes.object.isRequired,
  updateMapBounds: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func,
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  clearGeoJSONLayers: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FederatedResults
