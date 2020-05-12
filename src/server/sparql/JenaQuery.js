import { runSelectQuery } from './SparqlApi''
import { jenaQuery } from './SparqlQueriesGeneral'
import { makeObjectList } from './SparqlObjectMapper'
import { fullTextSearchProperties } from './sampo/SparqlQueriesFullText'

export const queryJenaIndex = async ({
  backendSearchConfig,
  queryTerm,
  resultClass,
  resultFormat
}) => {
  let q = jenaQuery
  const endpoint = backendSearchConfig[resultClass].endpoint
  q = q.replace('<QUERY>', `?id text:query ('${queryTerm.toLowerCase()}' 2000) .`)
  q = q.replace('<RESULT_SET_PROPERTIES>', fullTextSearchProperties)
  const results = await runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
    resultFormat
  })
  return results
}
