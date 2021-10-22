import { prefixes } from '../sparql_queries/SparqlQueriesPrefixes'

export const warsaConfig = {
  endpoint: {
    url: 'http://ldf.fi/warsa/sparql',
    prefixes,
    useAuth: false
  }
}
