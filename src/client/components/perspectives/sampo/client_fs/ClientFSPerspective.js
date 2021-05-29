import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import intl from 'react-intl-universal'
import { Route, Redirect } from 'react-router-dom'
import PerspectiveTabs from '../../../main_layout/PerspectiveTabs'
import LeafletMap from '../../../facet_results/LeafletMap'
import ResultInfo from '../../../facet_results/ResultInfo'
import VirtualizedTable from '../../../facet_results/VirtualizedTable'
import Pie from '../../../facet_results/Pie.js'
import CSVButton from '../../../facet_results/CSVButton'
import Footer from '../Footer'
import { createPopUpContentNameSampo, layerConfigs } from '../../../../configs/sampo/Leaflet/LeafletConfig'

const ClientFSPerspective = props => {
  const { rootUrl, perspective, screenSize } = props
  const layerControlExpanded = screenSize === 'md' ||
    screenSize === 'lg' ||
    screenSize === 'xl'
  return (
    <>
      <PerspectiveTabs
        routeProps={props.routeProps}
        tabs={perspective.tabs}
        screenSize={props.screenSize}
      />
      <Route
        exact path={`${rootUrl}/${perspective.id}/federated-search`}
        render={() => <Redirect to={`${rootUrl}/${perspective.id}/federated-search/table`} />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/federated-search/table`}
        render={() =>
          <VirtualizedTable
            list={Immutable.List(props.clientFSResults)}
            clientFS={props.clientFS}
            clientFSSortResults={props.clientFSSortResults}
            perspectiveID={perspective.id}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/federated-search/map_clusters`}
        render={() =>
          <LeafletMap
            center={[65.184809, 27.314050]}
            zoom={5}
            results={props.clientFSResults}
            leafletMapState={props.leafletMap}
            pageType='clientFSResults'
            mapMode='cluster'
            createPopUpContent={createPopUpContentNameSampo}
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
            layerConfigs={layerConfigs}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/federated-search/map_markers`}
        render={() => {
          if (props.clientFSResults.length > 3000) {
            return <ResultInfo message={intl.get('leafletMap.tooManyResults')} />
          } else {
            return (
              <LeafletMap
                center={[65.184809, 27.314050]}
                zoom={5}
                results={props.clientFSResults}
                leafletMapState={props.leafletMap}
                pageType='clientFSResults'
                mapMode='marker'
                createPopUpContent={createPopUpContentNameSampo}
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
                layerConfigs={layerConfigs}
              />
            )
          }
        }}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/federated-search/statistics`}
        render={() =>
          <Pie
            data={props.clientFSResults}
            groupBy={props.clientFS.groupBy}
            groupByLabel={props.clientFS.groupByLabel}
            query={props.clientFS.query}
          />}
      />
      <Route
        path={`${rootUrl}/${perspective.id}/federated-search/download`}
        render={() =>
          <CSVButton results={props.clientFSResults} />}
      />
      <Footer />
    </>
  )
}

ClientFSPerspective.propTypes = {
  routeProps: PropTypes.object.isRequired,
  perspective: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  clientFS: PropTypes.object.isRequired,
  clientFSResults: PropTypes.array,
  clientFSSortResults: PropTypes.func.isRequired,
  leafletMap: PropTypes.object.isRequired,
  fetchGeoJSONLayers: PropTypes.func,
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  clearGeoJSONLayers: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default ClientFSPerspective
