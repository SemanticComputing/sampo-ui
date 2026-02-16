import axios from 'axios'
import querystring from 'querystring'
import {isValidUrl} from "./Utils";

export const runSelectQuery = async ({
  query,
  endpoint,
  resultMapper,
  resultMapperConfig = null,
  postprocess = null,
  previousSelections = null, // not in use
  resultFormat,
  useAuth = false
}) => {
  if (!isValidUrl(endpoint)) {
    endpoint = process.env.SPARQL_ENDPOINT
  }
  const MIMEtype = resultFormat === 'json'
    ? 'application/sparql-results+json; charset=utf-8'
    : 'text/csv; charset=utf-8'
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: MIMEtype
  }
  if (useAuth) {
    headers.Authorization = `Basic ${process.env.SPARQL_ENDPOINT_BASIC_AUTH}`
  }
  const q = querystring.stringify({ query })
  try {
    const response = await axios({
      method: 'post',
      headers: headers,
      url: endpoint,
      data: q
    })
    if (resultFormat === 'json') {
      let mappedResults = resultMapperConfig
        ? resultMapper({ sparqlBindings: response.data.results.bindings, config: resultMapperConfig })
        : resultMapper(response.data.results.bindings)
      if (postprocess) {
        mappedResults = postprocess.func({ data: mappedResults, config: postprocess.config })
      }
      return {
        data: mappedResults,
        sparqlQuery: query
      }
    } else {
      return response.data
    }
  } catch (error) {
    // Handle logging error for server
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
      console.error(`Response status: ${error.response.status}\n`)
      console.error('Response data: \n')
      console.error(error.response.data)
      console.error('\n')
    }

    // rethrow error to give info to client side
    throw error
  }
}
