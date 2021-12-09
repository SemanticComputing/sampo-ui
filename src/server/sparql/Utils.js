import { readFile } from 'fs/promises'
import { has } from 'lodash'
import { backendSearchConfig } from '../sparql/sampo/BackendSearchConfig'

export const createBackendSearchConfig = async () => {
  const portalConfigJSON = await readFile('src/client/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const { portalID } = portalConfig
  const backendSearchConfig = {}
  for (const perspectiveID of portalConfig.perspectives.searchPerspectives) {
    const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/search_perspectives/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
    const { sparqlQueriesFile } = perspectiveConfig
    const sparqlQueries = await import(`../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)
    const { paginatedResultsConfig, instancePageConfig } = perspectiveConfig.resultClasses[perspectiveID]
    const paginatedResultsPropertiesQueryBlockID = paginatedResultsConfig.propertiesQueryBlock
    const instancePagePropertiesQueryBlockID = instancePageConfig.propertiesQueryBlock
    const paginatedResultsPropertiesQueryBlock = sparqlQueries[paginatedResultsPropertiesQueryBlockID]
    const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
    paginatedResultsConfig.propertiesQueryBlock = paginatedResultsPropertiesQueryBlock
    instancePageConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
    const { prefixesFile } = perspectiveConfig.endpoint
    const { prefixes } = await import(`../sparql/${portalID}/sparql_queries/${prefixesFile}`)
    perspectiveConfig.endpoint.prefixes = prefixes
    backendSearchConfig[perspectiveID] = perspectiveConfig
  }
  for (const perspectiveID of portalConfig.perspectives.onlyInstancePages) {
    const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/only_instance_pages/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
    const { sparqlQueriesFile } = perspectiveConfig
    const sparqlQueries = await import(`../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)
    const { instancePageConfig } = perspectiveConfig.resultClasses[perspectiveID]
    const instancePagePropertiesQueryBlockID = instancePageConfig.propertiesQueryBlock
    const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
    instancePageConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
    const { prefixesFile } = perspectiveConfig.endpoint
    const { prefixes } = await import(`../sparql/${portalID}/sparql_queries/${prefixesFile}`)
    perspectiveConfig.endpoint.prefixes = prefixes
    backendSearchConfig[perspectiveID] = perspectiveConfig
  }
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

const mergeResultClasses = async () => {
  const portalConfigJSON = await readFile('src/client/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const { portalID } = portalConfig
  const newPerspectiveConfigs = {}
  for (const newResultClass in backendSearchConfig) {
    const resultClassConfig = backendSearchConfig[newResultClass]
    if (has(resultClassConfig, 'perspectiveID')) {
      const { perspectiveID } = resultClassConfig
      const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/search_perspectives/${perspectiveID}.json`)
      if (!has(newPerspectiveConfigs, perspectiveID)) {
        newPerspectiveConfigs[perspectiveID] = JSON.parse(perspectiveConfigJSON)
      }
    }
  }
  for (const newResultClass in backendSearchConfig) {
    const resultClassConfig = backendSearchConfig[newResultClass]
    if (has(resultClassConfig, 'perspectiveID')) {
      const { perspectiveID } = resultClassConfig
      const { filterTarget, resultMapper, resultMapperConfig } = resultClassConfig
      let resultMapperName = null
      if (resultMapper) {
        resultMapperName = resultMapper.name
      }
      newPerspectiveConfigs[perspectiveID].resultClasses[newResultClass] = {
        ...(filterTarget && { filterTarget }),
        ...(resultMapperName && { resultMapper: resultMapperName }),
        ...(resultMapperConfig && { resultMapperConfig })
      }
    }
  }
  // const { q } = backendSearchConfig.eventLineChart
  // console.log(newPerspectiveConfigs.perspective1.resultClasses)
}
// const varToString = varObj => Object.keys(varObj)[0]

mergeResultClasses()
