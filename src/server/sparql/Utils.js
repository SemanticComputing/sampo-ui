import { readFile } from 'fs/promises'
import { has } from 'lodash'
// import { backendSearchConfig } from '../sparql/sampo/BackendSearchConfig'

export const createBackendSearchConfig = async () => {
  const portalConfigJSON = await readFile('src/client/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const resultMappers = await import('./Mappers')
  const { portalID } = portalConfig
  const backendSearchConfig = {}
  for (const perspectiveID of portalConfig.perspectives.searchPerspectives) {
    const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/search_perspectives/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
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
      const instancePagePropertiesQueryBlockID = instanceConfig.propertiesQueryBlock
      const paginatedResultsPropertiesQueryBlock = sparqlQueries[paginatedResultsPropertiesQueryBlockID]
      const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
      paginatedResultsConfig.propertiesQueryBlock = paginatedResultsPropertiesQueryBlock
      instanceConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
      if (has(instanceConfig, 'instancePageResultClasses')) {
        for (const instancePageResultClass in instanceConfig.instancePageResultClasses) {
          const instancePageResultClassConfig = instanceConfig.instancePageResultClasses[instancePageResultClass]
          if (instancePageResultClassConfig.sparqlQuery) {
            instancePageResultClassConfig.sparqlQuery = sparqlQueries[instancePageResultClassConfig.sparqlQuery]
          }
          if (instancePageResultClassConfig.sparqlQueryNodes) {
            instancePageResultClassConfig.sparqlQueryNodes = sparqlQueries[instancePageResultClassConfig.sparqlQueryNodes]
          }
        }
        hasInstancePageResultClasses = true
      }
      // handle other resultClasses
      for (const resultClass in perspectiveConfig.resultClasses) {
        if (resultClass === perspectiveID) { continue }
        const resultClassConfig = perspectiveConfig.resultClasses[resultClass]
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
    const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/only_instance_pages/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
    const { sparqlQueriesFile } = perspectiveConfig
    const sparqlQueries = await import(`../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)
    const { instanceConfig } = perspectiveConfig.resultClasses[perspectiveID]
    const instancePagePropertiesQueryBlockID = instanceConfig.propertiesQueryBlock
    const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
    instanceConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
    let hasInstancePageResultClasses = false
    if (has(instanceConfig, 'instancePageResultClasses')) {
      for (const instancePageResultClass in instanceConfig.instancePageResultClasses) {
        const instancePageResultClassConfig = instanceConfig.instancePageResultClasses[instancePageResultClass]
        if (instancePageResultClassConfig.sparqlQuery) {
          instancePageResultClassConfig.sparqlQuery = sparqlQueries[instancePageResultClassConfig.sparqlQuery]
        }
        if (instancePageResultClassConfig.sparqlQueryNodes) {
          instancePageResultClassConfig.sparqlQueryNodes = sparqlQueries[instancePageResultClassConfig.sparqlQueryNodes]
        }
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

export const mergeFacetConfigs = (oldFacets, mergedFacets) => {
  for (const facetID in oldFacets) {
    if (!has(mergedFacets, facetID)) {
      console.log(facetID + ' missing from new facets')
      continue
    }
    const oldFacet = oldFacets[facetID]
    // strip new lines
    if (oldFacet.facetValueFilter && oldFacet.facetValueFilter !== '') {
      oldFacet.facetValueFilter = oldFacet.facetValueFilter.replace(/\s+/g, ' ').trim()
    }
    if (oldFacet.predicate && oldFacet.predicate !== '') {
      oldFacet.predicate = oldFacet.predicate.replace(/\s+/g, ' ').trim()
    }
    if (oldFacet.labelPath && oldFacet.labelPath !== '') {
      oldFacet.labelPath = oldFacet.labelPath.replace(/\s+/g, ' ').trim()
    }
    if (oldFacet.textQueryPredicate && oldFacet.textQueryPredicate !== '') {
      oldFacet.textQueryPredicate = oldFacet.textQueryPredicate.replace(/\s+/g, ' ').trim()
    }

    if (oldFacet.type === 'text') {
      mergedFacets[facetID].facetType = 'text'
      mergedFacets[facetID].textQueryProperty = oldFacet.textQueryProperty
      if (oldFacet.textQueryPredicate && oldFacet.textQueryPredicate !== '') {
        mergedFacets[facetID].textQueryPredicate = oldFacet.textQueryPredicate
      } else {
        delete mergedFacets[facetID].textQueryPredicate
      }
      mergedFacets[facetID].sortByPredicate = oldFacet.labelPath
    }
    if (oldFacet.type === 'list') {
      if (oldFacet.facetValueFilter && oldFacet.facetValueFilter !== '') {
        mergedFacets[facetID].facetValueFilter = oldFacet.facetValueFilter
      }
      if (has(oldFacet, 'literal')) {
        mergedFacets[facetID].literal = oldFacet.literal
      }
      mergedFacets[facetID].facetType = 'list'
      mergedFacets[facetID].predicate = oldFacet.predicate
      mergedFacets[facetID].sortByPredicate = oldFacet.labelPath
    }

    if (oldFacet.type === 'hierarchical') {
      if (oldFacet.facetValueFilter && oldFacet.facetValueFilter !== '') {
        mergedFacets[facetID].facetValueFilter = oldFacet.facetValueFilter
      }
      mergedFacets[facetID].facetType = 'hierarchical'
      mergedFacets[facetID].predicate = oldFacet.predicate
      mergedFacets[facetID].sortByPredicate = oldFacet.labelPath
      mergedFacets[facetID].parentProperty = oldFacet.parentProperty
    }

    if (oldFacet.type === 'timespan') {
      mergedFacets[facetID].facetType = 'timespan'
      mergedFacets[facetID].sortByAscPredicate = oldFacet.sortByAscPredicate
      mergedFacets[facetID].sortByDescPredicate = oldFacet.sortByDescPredicate
      mergedFacets[facetID].predicate = oldFacet.predicate
      mergedFacets[facetID].startProperty = oldFacet.startProperty
      mergedFacets[facetID].endProperty = oldFacet.endProperty
    }
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
  console.log(JSON.stringify(mergedFacets))
}

export const mergeResultClasses = async oldBackendSearchConfig => {
  const portalConfigJSON = await readFile('src/client/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const { portalID } = portalConfig
  const newPerspectiveConfigs = {}
  // build initial config object
  for (const newResultClass in oldBackendSearchConfig) {
    const resultClassConfig = oldBackendSearchConfig[newResultClass]
    if (has(resultClassConfig, 'perspectiveID')) {
      const { perspectiveID } = resultClassConfig
      if (!has(newPerspectiveConfigs, perspectiveID)) {
        const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/search_perspectives/${perspectiveID}.json`)
        newPerspectiveConfigs[perspectiveID] = JSON.parse(perspectiveConfigJSON)
      }
    }
  }
  // merge result classes
  for (const newResultClass in oldBackendSearchConfig) {
    const resultClassConfig = oldBackendSearchConfig[newResultClass]
    if (has(resultClassConfig, 'perspectiveID')) {
      const { perspectiveID } = resultClassConfig
      const { q, nodes, filterTarget, resultMapper, resultMapperConfig, instance, properties, useNetworkAPI } = resultClassConfig
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
      newPerspectiveConfigs[perspectiveID].resultClasses[newResultClass] = {
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
      console.log(`no perspectiveID for: ${newResultClass}`)
    }
  }
  // for (const perspectiveID in newPerspectiveConfigs) {
  //   console.log(perspectiveID)
  //   console.log(JSON.stringify(newPerspectiveConfigs[perspectiveID]))
  // }
}

// mergeResultClasses()
createBackendSearchConfig()
