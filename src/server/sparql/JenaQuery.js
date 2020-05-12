import { has } from 'lodash'
import { runSelectQuery } from './SparqlApi'
import { jenaQuery } from './SparqlQueriesGeneral'
import { makeObjectList } from './SparqlObjectMapper'

export const queryJenaIndex = async ({
  backendSearchConfig,
  queryTerm,
  resultClass,
  resultFormat
}) => {
  let q = jenaQuery
  const config = backendSearchConfig[resultClass]
  let endpoint
  if (has(config, 'endpoint')) {
    endpoint = config.endpoint
  } else {
    endpoint = backendSearchConfig[config.perspectiveID].endpoint
  }
  const { properties } = config
  q = q.replace('<QUERY>', `?id text:query ('${queryTerm.toLowerCase()}' 2000) .`)
  q = q.replace('<RESULT_SET_PROPERTIES>', properties)
  const results = await runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
    resultFormat
  })
  return results
}
