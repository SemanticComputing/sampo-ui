import { readFile } from 'fs/promises'

export const createBackendSearchConfig = async () => {
  const portalConfigJSON = await readFile('src/client/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const { portalID } = portalConfig
  const backendSearchConfig = {}
  for (const perspectiveID of portalConfig.perspectives.searchPerspectives) {
    const perspectiveConfigJSON = await readFile(`src/client/configs/${portalID}/perspective_configs/search_perspectives/${perspectiveID}.json`)
    const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
    const perspectiveIDCapitalized = perspectiveID.charAt(0).toUpperCase() + perspectiveID.slice(1).toLowerCase()
    const sparqlQueries = await import(`../sparql/${portalID}/sparql_queries/SparqlQueries${perspectiveIDCapitalized}`)
    const paginatedResultsPropertiesQueryBlockID = perspectiveConfig.paginatedResultsConfig.propertiesQueryBlock
    const paginatedResultsPropertiesQueryBlock = sparqlQueries[paginatedResultsPropertiesQueryBlockID]
    perspectiveConfig.paginatedResultsConfig.propertiesQueryBlock = paginatedResultsPropertiesQueryBlock
    const prefixesID = perspectiveConfig.endpoint.prefixes
    const { prefixes } = await import(`../sparql/${portalID}/sparql_queries/${prefixesID}`)
    perspectiveConfig.endpoint.prefixes = prefixes
    backendSearchConfig[perspectiveID] = perspectiveConfig
  }
  return backendSearchConfig
}
