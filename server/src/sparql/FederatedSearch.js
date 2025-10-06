import { runSelectQuery } from './SparqlApi'
import {
  mapNameSampoResults
} from './Mappers'

const getResults = async (federatedSearchDatasets, queryTerm, latMin, longMin, latMax, longMax, datasetId, resultFormat) => {
  const { endpoint, resultQuery } = federatedSearchDatasets[datasetId]
  let query = ''
  if (datasetId !== 'tgn') {
    if (queryTerm !== '') {
      query = resultQuery.replace('<QUERY>', `?id text:query (skos:prefLabel '${queryTerm.toLowerCase()}' 100000) .`)
    } else if (latMin !== 0) {
      query = resultQuery.replace('<QUERY>', `?id spatial:withinBox (${latMin} ${longMin} ${latMax} ${longMax} 1000000) .`)
    }
  } else {
    query = resultQuery.replace(/<QUERYTERM>/g, queryTerm.toLowerCase())
  }
  return runSelectQuery({
    query,
    endpoint,
    resultMapper: mapNameSampoResults,
    resultFormat
  })
}

export const getFederatedResults = async ({
  federatedSearchDatasets,
  queryTerm,
  latMin,
  longMin,
  latMax,
  longMax,
  datasets,
  resultFormat
}) => {
  const federatedResults = await Promise.all(datasets.map((datasetId) =>
    getResults(federatedSearchDatasets, queryTerm, latMin, longMin, latMax, longMax, datasetId, resultFormat)))

  // merge search results from multiple endpoints into a single array
  let results = []
  federatedResults.forEach(resultSet => {
    results = [...results, ...resultSet.data]
  })

  return results
}
