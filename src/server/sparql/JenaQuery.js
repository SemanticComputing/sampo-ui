import { runSelectQuery } from './SparqlApi'
import { endpoint } from './sampo/FacetConfigsSampo'
import { prefixes } from './sampo/SparqlQueriesPrefixes'
import { jenaQuery } from './SparqlQueriesGeneral'
import { makeObjectList } from './SparqlObjectMapper'
import { fullTextSearchProperties } from './sampo/SparqlQueriesFullText'

export const queryJenaIndex = async ({
  queryTerm,
  resultFormat
}) => {
  let q = jenaQuery
  q = q.replace('<QUERY>', `?id text:query ('${queryTerm.toLowerCase()}' 2000) .`)
  q = q.replace('<RESULT_SET_PROPERTIES>', fullTextSearchProperties)
  const results = await runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: makeObjectList,
    resultFormat
  })
  return results
}
