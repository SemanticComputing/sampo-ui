import React, { lazy } from 'react'
import intl from 'react-intl-universal'
import { Route } from 'react-router-dom'
import { has } from 'lodash'
const ResultTable = lazy(() => import('./ResultTable'))
const InstancePageTable = lazy(() => import('../main_layout/InstancePageTable'))
const ReactVirtualizedList = lazy(() => import('./ReactVirtualizedList'))
const LeafletMap = lazy(() => import('./LeafletMap'))
const Deck = lazy(() => import('./Deck'))
const ApexCharts = lazy(() => import('./ApexCharts'))
const Network = lazy(() => import('./Network'))
// const BarChartRace = lazy(() => import('../../facet_results/BarChartRace'))
const ExportCSV = lazy(() => import('./ExportCSV'))
const Export = lazy(() => import('./Export'))

const getVisibleRows = perspectiveState => {
  const { properties, instanceTableData } = perspectiveState
  const visibleRows = []
  const instanceClass = instanceTableData.type ? instanceTableData.type.id : ''
  properties.forEach(row => {
    if ((has(row, 'onlyForClass') && row.onlyForClass === instanceClass) ||
       !has(row, 'onlyForClass')) {
      visibleRows.push(row)
    }
  })
  return visibleRows
}

const ResultClassRoute = props => {
  const {
    rootUrl, perspective, perspectiveState, facetState, screenSize, portalConfig,
    layoutConfig, resultClass, facetClass, resultClassConfig, path
  } = props
  const { maps } = perspectiveState
  const layerControlExpanded = screenSize === 'md' ||
  screenSize === 'lg' ||
  screenSize === 'xl'
  let popupMaxHeight = 320
  let popupMinWidth = 280
  let popupMaxWidth = 280
  if (screenSize === 'xs' || screenSize === 'sm') {
    popupMaxHeight = 200
    popupMinWidth = 150
    popupMaxWidth = 150
  }
  const { component } = resultClassConfig
  let routeComponent
  switch (component) {
    case 'ResultTable':
      routeComponent = (
        <Route
          path={path}
          render={routeProps =>
            <ResultTable
              portalConfig={portalConfig}
              perspectiveConfig={perspective}
              data={perspectiveState}
              facetUpdateID={facetState.facetUpdateID}
              resultClass={resultClass}
              facetClass={facetClass}
              fetchPaginatedResults={props.fetchPaginatedResults}
              updatePage={props.updatePage}
              updateRowsPerPage={props.updateRowsPerPage}
              sortResults={props.sortResults}
              routeProps={routeProps}
              rootUrl={rootUrl}
              layoutConfig={layoutConfig}
            />}
        />
      )
      break
    case 'ReactVirtualizedList':
      routeComponent = (
        <Route
          path={path}
          render={routeProps =>
            <ReactVirtualizedList
              resultClass={resultClass}
              facetClass={facetClass}
              fetchResults={props.fetchResults}
              perspectiveState={perspectiveState}
              facetUpdateID={facetState.facetUpdateID}
              layoutConfig={layoutConfig}
            />}
        />
      )
      break
    case 'InstancePageTable': {
      const properties = resultClassConfig.properties
        ? resultClassConfig.properties
        : getVisibleRows(perspectiveState)
      let instanceTableProps = {
        portalConfig,
        perspectiveConfig: perspective,
        layoutConfig,
        resultClass,
        fetchResults: props.fetchResults,
        properties,
        screenSize
      }
      if (resultClassConfig.fetchResultsWhenMounted) {
        instanceTableProps = {
          ...instanceTableProps,
          fetchResultsWhenMounted: true,
          data: perspectiveState.results ? perspectiveState.results[0] : null,
          uri: perspectiveState.instanceTableData.id,
          resultUpdateID: perspectiveState.resultUpdateID
        }
      } else {
        instanceTableProps = {
          ...instanceTableProps,
          data: perspectiveState.instanceTableData
        }
      }
      routeComponent = (
        <Route
          path={path}
          render={routeProps => <InstancePageTable {...instanceTableProps} />}
        />
      )
      break
    }
    case 'LeafletMap': {
      const {
        facetID = null,
        mapMode = 'cluster',
        pageType = 'facetResults',
        showExternalLayers = false,
        customMapControl = false,
        showInstanceCountInClusters = true
      } = resultClassConfig
      const resultClassMap = maps[resultClass]
      let createPopUpContent = props.leafletConfig.createPopUpContentDefault
      if (resultClassConfig.instanceConfig && resultClassConfig.instanceConfig.createPopUpContent) {
        createPopUpContent = props.leafletConfig[resultClassConfig.instanceConfig.createPopUpContent]
      }
      let leafletProps = {
        portalConfig,
        perspectiveConfig: perspective,
        center: resultClassMap.center,
        zoom: resultClassMap.zoom,
        results: perspectiveState.results,
        leafletMapState: props.leafletMapState,
        pageType,
        resultClass,
        facetClass,
        mapMode,
        instance: perspectiveState.instanceTableData,
        createPopUpContent,
        popupMaxHeight,
        popupMinWidth,
        popupMaxWidth,
        fetchResults: props.fetchResults,
        fetchGeoJSONLayers: props.fetchGeoJSONLayers,
        clearGeoJSONLayers: props.clearGeoJSONLayers,
        fetchByURI: props.fetchByURI,
        fetching: perspectiveState.fetching,
        showInstanceCountInClusters,
        updateMapBounds: props.updateMapBounds,
        showError: props.showError,
        showExternalLayers,
        layerControlExpanded,
        customMapControl,
        layerConfigs: props.leafletConfig.layerConfigs,
        infoHeaderExpanded: perspectiveState.facetedSearchHeaderExpanded,
        layoutConfig: props.layoutConfig
      }
      if (facetID) {
        leafletProps = {
          ...leafletProps,
          facetUpdateID: facetState.facetUpdateID,
          facet: facetState.facets[facetID],
          facetID,
          updateFacetOption: props.updateFacetOption
        }
      }
      if (pageType === 'instancePage') {
        leafletProps.uri = perspectiveState.instanceTableData.id
      }
      routeComponent = (
        <Route
          path={path}
          render={() =>
            <LeafletMap {...leafletProps} />}
        />
      )
      break
    }
    case 'Deck': {
      const { layerType, showTooltips = false } = resultClassConfig
      const { instanceAnalysisData, instanceAnalysisDataUpdateID } = perspectiveState
      const resultClassMap = maps[resultClass]
      let deckProps = {
        portalConfig,
        perspectiveConfig: perspective,
        center: resultClassMap.center,
        zoom: resultClassMap.zoom,
        results: perspectiveState.results,
        facetUpdateID: facetState.facetUpdateID,
        resultClass,
        facetClass,
        fetchResults: props.fetchResults,
        fetching: perspectiveState.fetching,
        fetchInstanceAnalysis: props.fetchInstanceAnalysis,
        fetchingInstanceAnalysisData: perspectiveState.fetchingInstanceAnalysisData,
        layerType,
        updateMapBounds: props.updateMapBounds,
        showTooltips,
        layoutConfig: props.layoutConfig
      }
      if (instanceAnalysisData) {
        deckProps = {
          ...deckProps,
          instanceAnalysisData,
          instanceAnalysisDataUpdateID
        }
      }
      if (layerType === 'arcLayer') {
        const { arcWidthVariable, instanceVariable } = resultClassConfig
        deckProps = {
          ...deckProps,
          getArcWidth: d => d[arcWidthVariable],
          fromText: intl.get(`deckGlMap.${resultClass}.from`),
          toText: intl.get(`deckGlMap.${resultClass}.to`),
          countText: intl.get(`deckGlMap.${resultClass}.count`),
          legendTitle: intl.get(`deckGlMap.${resultClass}.legendTitle`),
          legendFromText: intl.get(`deckGlMap.${resultClass}.legendFrom`),
          legendToText: intl.get(`deckGlMap.${resultClass}.legendTo`),
          showMoreText: intl.get('deckGlMap.showMoreInformation'),
          listHeadingSingleInstance: intl.get(`deckGlMap.${resultClass}.listHeadingSingleInstance`),
          listHeadingMultipleInstances: intl.get(`deckGlMap.${resultClass}.listHeadingMultipleInstances`),
          instanceVariable
        }
      }
      routeComponent = (
        <Route
          path={path}
          render={() => <Deck {...deckProps} />}
        />
      )
      break
    }
    case 'ApexCharts': {
      const {
        pageType = 'facetResults',
        title,
        xAxisTitle,
        xaxisType,
        xaxisTickAmount,
        yaxisTitle,
        seriesTitle,
        stroke,
        fill,
        createChartData,
        doNotRenderOnMount = false,
        dropdownForResultClasses = false,
        dropdownForChartTypes = false
      } = resultClassConfig
      const apexProps = {
        portalConfig,
        perspectiveConfig: perspective,
        pageType,
        resultClass,
        facetClass,
        rawData: perspectiveState.results,
        rawDataUpdateID: perspectiveState.resultUpdateID,
        facetUpdateID: facetState.facetUpdateID,
        fetching: perspectiveState.fetching,
        fetchData: props.fetchResults,
        createChartData: props.apexChartsConfig[createChartData],
        title,
        xAxisTitle,
        xaxisType,
        xaxisTickAmount,
        yaxisTitle,
        seriesTitle,
        stroke,
        fill,
        layoutConfig: props.layoutConfig,
        doNotRenderOnMount,
        dropdownForResultClasses
      }
      if (dropdownForResultClasses && has(resultClassConfig, 'resultClasses')) {
        apexProps.resultClass = resultClassConfig.resultClasses[0]
        apexProps.resultClasses = resultClassConfig.resultClasses
        apexProps.dropdownForResultClasses = true
      }
      if (dropdownForChartTypes && has(resultClassConfig, 'chartTypes')) {
        const { chartTypes } = resultClassConfig
        const newChartTypes = chartTypes.map(chartType => {
          return {
            id: chartType.id,
            createChartData: props.apexChartsConfig[chartType.createChartData]
          }
        })
        apexProps.chartTypes = newChartTypes
        apexProps.dropdownForChartTypes = true
      }
      routeComponent = (
        <Route
          path={path}
          render={() =>
            <ApexCharts {...apexProps} />}
        />
      )
      break
    }
    case 'Network': {
      const { networkConfig } = props
      const {
        pageType = 'facetResults',
        limit,
        optimize,
        style,
        layout,
        preprocess
      } = resultClassConfig
      let networkProps = {
        portalConfig,
        perspectiveConfig: perspective,
        pageType,
        resultClass,
        facetClass,
        results: perspectiveState.results,
        resultUpdateID: perspectiveState.resultUpdateID,
        fetching: perspectiveState.fetching,
        fetchResults: props.fetchResults,
        layoutConfig: props.layoutConfig,
        limit,
        optimize,
        style: networkConfig[style],
        layout: networkConfig[layout],
        preprocess: networkConfig[preprocess]
      }
      if (pageType === 'facetResults') {
        networkProps = {
          ...networkProps,
          facetUpdateID: facetState.facetUpdateID
        }
      }
      if (pageType === 'instancePage') {
        networkProps.uri = perspectiveState.instanceTableData.id
      }
      routeComponent = (
        <Route
          path={path}
          render={() =>
            <Network {...networkProps} />}
        />
      )
      break
    }
    case 'Export': {
      const { pageType = 'facetResults' } = resultClassConfig
      const exportResultClass = resultClassConfig.resultClass
      routeComponent = (
        <Route
          path={path}
          render={routeProps =>
            <Export
              portalConfig={portalConfig}
              data={perspectiveState}
              resultClass={exportResultClass}
              facetClass={facetClass}
              pageType={pageType}
              fetchPaginatedResults={props.fetchPaginatedResults}
              updatePage={props.updatePage}
              layoutConfig={props.layoutConfig}
            />}
        />
      )
      break
    }
    case 'ExportCSV': {
      routeComponent = (
        <Route
          path={path}
          render={routeProps =>
            <ExportCSV
              resultClass={resultClass}
              facetClass={facetClass}
              facetUpdateID={facetState.facetUpdateID}
              facets={facetState.facets}
              layoutConfig={layoutConfig}
            />}
        />
      )
      break
    }
    default:
      routeComponent = <></>
      break
  }
  return routeComponent
}

export default ResultClassRoute
