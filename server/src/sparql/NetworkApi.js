import axios from 'axios'

export const runNetworkQuery = async ({
  endpoint,
  prefixes,
  links,
  limit,
  nodes,
  id,
  optimize
}) => {
  const payload = {
    endpoint,
    prefixes,
    links,
    nodes,
    limit,
    id,
    optimize,
    customHttpHeaders: { Authorization: `Basic ${process.env.SPARQL_ENDPOINT_BASIC_AUTH}` }
  }
  const url = 'https://sparql-network.demo.seco.cs.aalto.fi/query' // 'http://127.0.0.1:5000/query'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axios.post(url, payload, config)
    return {
      data: response.data
    }
  } catch (error) {
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
      console.log(error.response.data)
    // console.log(error.response.status);
    // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
    // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    console.log(error.config)
  }
}
