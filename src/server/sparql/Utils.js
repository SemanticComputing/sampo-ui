import { readFile } from 'fs/promises'

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
