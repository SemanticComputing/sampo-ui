import { runSelectQuery } from './SparqlApi';
import { prefixes } from './SparqlQueriesPrefixes';
import { endpoint, jenaQuery  } from './SparqlQueriesGeneral';
import { makeObjectList } from './SparqlObjectMapper';

export const queryJenaIndex = async ({
  queryTerm,
  resultFormat
}) => {
  let q = jenaQuery;
  q = q.replace('<QUERY>', `
  ?id text:query ('${queryTerm.toLowerCase()}' 2000) .
  `);
  const results = await runSelectQuery(prefixes + q, endpoint, makeObjectList, resultFormat);
  return results;
};
