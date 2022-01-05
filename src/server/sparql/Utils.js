import { readFile } from 'fs/promises'
import { has } from 'lodash'

// import { backendSearchConfig as oldBackendSearchConfig } from './veterans/BackendSearchConfig'

// import { battlesPerspectiveConfig as oldPerspectiveConfig } from './sotasurmat/perspective_configs/BattlesPerspectiveConfig'
// import { INITIAL_STATE } from '../../client/reducers/sotasurmat/battlesFacets'

export const createBackendSearchConfig = async () => {
  const portalConfigJSON = await readFile('src/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const resultMappers = await import('./Mappers')
  const { portalID } = portalConfig
  const backendSearchConfig = {}
  for (const perspectiveID of portalConfig.perspectives.searchPerspectives) {
    const perspectiveConfigJSON = await readFile(`src/configs/${portalID}/search_perspectives/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
    if (!has(perspectiveConfig, 'sparqlQueriesFile')) { continue } // skip dummy perspectives
    const { sparqlQueriesFile } = perspectiveConfig
    const sparqlQueries = await import(`../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)
    if (has(perspectiveConfig, 'endpoint')) {
      const { prefixesFile } = perspectiveConfig.endpoint
      const { prefixes } = await import(`../sparql/${portalID}/sparql_queries/${prefixesFile}`)
      perspectiveConfig.endpoint.prefixes = prefixes
    }
    if (perspectiveConfig.searchMode === 'faceted-search') {
      let hasInstancePageResultClasses = false
      // handle default resultClass which is same as perspectiveID
      const { paginatedResultsConfig, instanceConfig } = perspectiveConfig.resultClasses[perspectiveID]
      const paginatedResultsPropertiesQueryBlockID = paginatedResultsConfig.propertiesQueryBlock
      const paginatedResultsPropertiesQueryBlock = sparqlQueries[paginatedResultsPropertiesQueryBlockID]
      paginatedResultsConfig.propertiesQueryBlock = paginatedResultsPropertiesQueryBlock
      if (paginatedResultsConfig.postprocess) {
        paginatedResultsConfig.postprocess.func = resultMappers[paginatedResultsConfig.postprocess.func]
      }
      if (instanceConfig) {
        const instancePagePropertiesQueryBlockID = instanceConfig.propertiesQueryBlock
        const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
        instanceConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
        if (instanceConfig.postprocess) {
          instanceConfig.postprocess.func = resultMappers[instanceConfig.postprocess.func]
        }
        if (has(instanceConfig, 'instancePageResultClasses')) {
          for (const instancePageResultClass in instanceConfig.instancePageResultClasses) {
            const instancePageResultClassConfig = instanceConfig.instancePageResultClasses[instancePageResultClass]
            processResultClassConfig(instancePageResultClassConfig, sparqlQueries, resultMappers)
          }
          hasInstancePageResultClasses = true
        }
      }
      // handle other resultClasses
      let extraResultClasses = {}
      for (const resultClass in perspectiveConfig.resultClasses) {
        if (resultClass === perspectiveID) { continue }
        const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
        processResultClassConfig(resultClassConfig, sparqlQueries, resultMappers)
        if (resultClassConfig.resultClasses) {
          for (const extraResultClass in resultClassConfig.resultClasses) {
            processResultClassConfig(resultClassConfig.resultClasses[extraResultClass], sparqlQueries, resultMappers)
          }
          extraResultClasses = {
            ...extraResultClasses,
            ...resultClassConfig.resultClasses
          }
        }
      }
      perspectiveConfig.resultClasses = {
        ...perspectiveConfig.resultClasses,
        ...extraResultClasses
      }
      // merge facet results and instance page result classes
      if (hasInstancePageResultClasses) {
        perspectiveConfig.resultClasses = {
          ...perspectiveConfig.resultClasses,
          ...perspectiveConfig.resultClasses[perspectiveID].instanceConfig.instancePageResultClasses
        }
      }
    }
    if (perspectiveConfig.searchMode === 'federated-search') {
      for (const dataset in perspectiveConfig.datasets) {
        perspectiveConfig.datasets[dataset].resultQuery = sparqlQueries.federatedSearchSparqlQueries[dataset].resultQuery
      }
    }
    if (perspectiveConfig.searchMode === 'full-text-search') {
      const queryBlockID = perspectiveConfig.propertiesQueryBlock
      const queryBlock = sparqlQueries[queryBlockID]
      perspectiveConfig.propertiesQueryBlock = queryBlock
    }
    backendSearchConfig[perspectiveID] = perspectiveConfig
  }
  for (const perspectiveID of portalConfig.perspectives.onlyInstancePages) {
    const perspectiveConfigJSON = await readFile(`src/configs/${portalID}/only_instance_pages/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
    const { sparqlQueriesFile } = perspectiveConfig
    const sparqlQueries = await import(`../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)
    const { instanceConfig } = perspectiveConfig.resultClasses[perspectiveID]
    const instancePagePropertiesQueryBlockID = instanceConfig.propertiesQueryBlock
    const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
    instanceConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
    if (instanceConfig.postprocess) {
      instanceConfig.postprocess.func = resultMappers[instanceConfig.postprocess.func]
    }
    let hasInstancePageResultClasses = false
    if (has(instanceConfig, 'instancePageResultClasses')) {
      for (const instancePageResultClass in instanceConfig.instancePageResultClasses) {
        const instancePageResultClassConfig = instanceConfig.instancePageResultClasses[instancePageResultClass]
        processResultClassConfig(instancePageResultClassConfig, sparqlQueries, resultMappers)
      }
      hasInstancePageResultClasses = true
    }
    if (hasInstancePageResultClasses) {
      perspectiveConfig.resultClasses = {
        ...perspectiveConfig.resultClasses,
        ...perspectiveConfig.resultClasses[perspectiveID].instanceConfig.instancePageResultClasses
      }
    }
    const { prefixesFile } = perspectiveConfig.endpoint
    const { prefixes } = await import(`../sparql/${portalID}/sparql_queries/${prefixesFile}`)
    perspectiveConfig.endpoint.prefixes = prefixes
    backendSearchConfig[perspectiveID] = perspectiveConfig
  }
  // console.log(Object.keys(backendSearchConfig))
  return backendSearchConfig
}

const processResultClassConfig = (resultClassConfig, sparqlQueries, resultMappers) => {
  if (resultClassConfig.sparqlQuery) {
    resultClassConfig.sparqlQuery = sparqlQueries[resultClassConfig.sparqlQuery]
  }
  if (resultClassConfig.sparqlQueryNodes) {
    resultClassConfig.sparqlQueryNodes = sparqlQueries[resultClassConfig.sparqlQueryNodes]
  }
  if (resultClassConfig.instanceConfig) {
    const { instanceConfig } = resultClassConfig
    if (instanceConfig.propertiesQueryBlock) {
      instanceConfig.propertiesQueryBlock = sparqlQueries[instanceConfig.propertiesQueryBlock]
    }
    if (instanceConfig.relatedInstances) {
      instanceConfig.relatedInstances = sparqlQueries[instanceConfig.relatedInstances]
    }
  }
  if (resultClassConfig.resultMapper) {
    resultClassConfig.resultMapper = resultMappers[resultClassConfig.resultMapper]
  }
  if (resultClassConfig.postprocess) {
    resultClassConfig.postprocess.func = resultMappers[resultClassConfig.postprocess.func]
  }
}

export const mergeFacetConfigs = (clientFacets, serverFacets) => {
  const mergedFacets = {}
  for (const clientFacetID in clientFacets) {
    if (!has(serverFacets, clientFacetID)) {
      console.log(clientFacetID + ' missing from serverFacets')
      continue
    }
    const clientFacet = clientFacets[clientFacetID]
    const serverFacet = serverFacets[clientFacetID]
    // strip new lines
    if (serverFacet.facetValueFilter && serverFacet.facetValueFilter !== '') {
      serverFacet.facetValueFilter = serverFacet.facetValueFilter.replace(/\s+/g, ' ').trim()
    }
    if (serverFacet.facetLabelFilter && serverFacet.facetLabelFilter !== '') {
      serverFacet.facetLabelFilter = serverFacet.facetLabelFilter.replace(/\s+/g, ' ').trim()
    }
    if (serverFacet.predicate && serverFacet.predicate !== '') {
      serverFacet.predicate = serverFacet.predicate.replace(/\s+/g, ' ').trim()
    }
    if (serverFacet.labelPath && serverFacet.labelPath !== '') {
      serverFacet.labelPath = serverFacet.labelPath.replace(/\s+/g, ' ').trim()
    }
    if (serverFacet.orderByPattern && serverFacet.orderByPattern !== '') {
      serverFacet.orderByPattern = serverFacet.orderByPattern.replace(/\s+/g, ' ').trim()
    }
    if (serverFacet.textQueryPredicate && serverFacet.textQueryPredicate !== '') {
      serverFacet.textQueryPredicate = serverFacet.textQueryPredicate.replace(/\s+/g, ' ').trim()
    }

    // start building new facet config object
    const mergedFacet = {
      containerClass: clientFacet.containerClass,
      filterType: clientFacet.filterType
    }
    if (clientFacet.searchField) {
      mergedFacet.searchField = clientFacet.searchField
    }
    if (clientFacet.sortButton) {
      mergedFacet.sortButton = clientFacet.sortButton
    }
    if (clientFacet.spatialFilterButton) {
      mergedFacet.spatialFilterButton = clientFacet.spatialFilterButton
    }
    if (clientFacet.pieChartButton) {
      mergedFacet.pieChartButton = clientFacet.pieChartButton
    }
    if (clientFacet.lineChartButton) {
      mergedFacet.lineChartButton = clientFacet.lineChartButton
    }

    // labelPath --> sortByPredicate
    if (serverFacet.labelPath) {
      mergedFacet.sortByPredicate = serverFacet.labelPath
    }
    if (serverFacet.orderByPattern) {
      mergedFacet.sortByPattern = serverFacet.orderByPattern
    }

    if (serverFacet.type === 'text') {
      mergedFacet.facetType = 'text'
      if (serverFacet.textQueryPredicate && serverFacet.textQueryPredicate !== '') {
        mergedFacet.textQueryPredicate = serverFacet.textQueryPredicate
      }
      if (serverFacet.textQueryProperty && serverFacet.textQueryProperty !== '') {
        mergedFacet.textQueryProperty = serverFacet.textQueryProperty
      }
    }

    if (serverFacet.type === 'list') {
      if (serverFacet.facetValueFilter && serverFacet.facetValueFilter !== '') {
        mergedFacet.facetValueFilter = serverFacet.facetValueFilter
      }
      if (serverFacet.facetLabelFilter && serverFacet.facetLabelFilter !== '') {
        mergedFacet.facetLabelFilter = serverFacet.facetLabelFilter
      }
      if (has(serverFacet, 'literal')) {
        mergedFacet.literal = serverFacet.literal
      }
      mergedFacet.facetType = 'list'
      mergedFacet.predicate = serverFacet.predicate
      mergedFacet.sortBy = clientFacet.sortBy
      mergedFacet.sortDirection = clientFacet.sortDirection
    }

    if (serverFacet.type === 'hierarchical') {
      if (serverFacet.facetValueFilter && serverFacet.facetValueFilter !== '') {
        mergedFacet.facetValueFilter = serverFacet.facetValueFilter
      }
      if (serverFacet.facetLabelFilter && serverFacet.facetLabelFilter !== '') {
        mergedFacet.facetLabelFilter = serverFacet.facetLabelFilter
      }
      mergedFacet.facetType = 'hierarchical'
      mergedFacet.predicate = serverFacet.predicate
      mergedFacet.parentProperty = serverFacet.parentProperty
    }

    if (serverFacet.type === 'timespan') {
      mergedFacet.facetType = 'timespan'
      if (serverFacet.sortByAscPredicate) {
        mergedFacet.sortByAscPredicate = serverFacet.sortByAscPredicate
      }
      if (serverFacet.sortByDescPredicate) {
        mergedFacet.sortByDescPredicate = serverFacet.sortByDescPredicate
      }
      mergedFacet.predicate = serverFacet.predicate
      mergedFacet.startProperty = serverFacet.startProperty
      mergedFacet.endProperty = serverFacet.endProperty
      mergedFacet.max = clientFacet.max
      mergedFacet.min = clientFacet.min
    }

    if (serverFacet.type === 'integer') {
      mergedFacet.predicate = serverFacet.predicate
      mergedFacet.typecasting = serverFacet.typecasting
      mergedFacet.facetType = 'integer'
    }

    mergedFacets[clientFacetID] = mergedFacet
  }
  for (const facetID in mergedFacets) {
    const unorderedFacet = mergedFacets[facetID]
    const orderedFacet = Object.keys(unorderedFacet).sort().reduce(
      (obj, key) => {
        obj[key] = unorderedFacet[key]
        return obj
      },
      {}
    )
    mergedFacets[facetID] = orderedFacet
  }
  // console.log(mergedFacets)
  console.log(JSON.stringify(mergedFacets))
}

export const createExtraResultClassesForJSONConfig = async oldBackendSearchConfig => {
  // const portalConfigJSON = await readFile('src/configs/portalConfig.json')
  // const portalConfig = JSON.parse(portalConfigJSON)
  // const { portalID } = portalConfig
  // const newPerspectiveConfigs = {}
  // // build initial config object
  // for (const newResultClass in oldBackendSearchConfig) {
  //   const resultClassConfig = oldBackendSearchConfig[newResultClass]
  //   if (has(resultClassConfig, 'perspectiveID')) {
  //     const { perspectiveID } = resultClassConfig
  //     if (!has(newPerspectiveConfigs, perspectiveID)) {
  //       const perspectiveConfigJSON = await readFile(`src/configs/${portalID}/search_perspectives/${perspectiveID}.json`)
  //       newPerspectiveConfigs[perspectiveID] = JSON.parse(perspectiveConfigJSON)
  //     }
  //   }
  // }

  // create resultClass configs
  const resultClasses = {}
  for (const resultClass in oldBackendSearchConfig) {
    const resultClassConfig = oldBackendSearchConfig[resultClass]
    if (has(resultClassConfig, 'perspectiveID')) {
      // console.log(resultClass)
      // const { perspectiveID } = resultClassConfig
      const { q, nodes, filterTarget, resultMapper, resultMapperConfig, instance, properties, useNetworkAPI } = resultClassConfig
      if (instance && instance.relatedInstances === '') {
        delete instance.relatedInstances
      }
      let { postprocess } = resultClassConfig
      let resultMapperName = null
      if (resultMapper) {
        resultMapperName = resultMapper.name
      }
      if (postprocess) {
        postprocess = {
          func: postprocess.func.name,
          config: {
            ...postprocess.config
          }
        }
      }
      resultClasses[resultClass] = {
        ...(q && { sparqlQuery: q }),
        ...(nodes && { sparqlQueryNodes: nodes }),
        ...(filterTarget && { filterTarget }),
        ...(resultMapperName && { resultMapper: resultMapperName }),
        ...(resultMapperConfig && { resultMapperConfig }),
        ...(postprocess && { postprocess }),
        ...(instance && { instance }),
        ...(properties && { propertiesQueryBlock: properties }), // for jena text only
        ...(useNetworkAPI && { useNetworkAPI }) // for federated search only
      }
    } else {
      console.log(`no perspectiveID for: ${resultClass}`)
    }
  }
  console.log(JSON.stringify(resultClasses))
}

// createExtraResultClassesForJSONConfig(oldBackendSearchConfig)
// mergeFacetConfigs(INITIAL_STATE.facets, oldPerspectiveConfig.facets)
