import axios from 'axios';
import querystring from 'querystring';
// const defaultConstructHeaders = {
//   'Content-Type': 'application/x-www-form-urlencoded',
//   'Accept': 'text/turtle'
// };

export const runSelectQuery = async (query, endpoint, resultMapper, resultFormat) => {
  let MIMEtype = resultFormat === 'json'
    ? 'application/sparql-results+json; charset=utf-8'
    : 'text/csv; charset=utf-8';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': MIMEtype
  };
  try {
    const response = await axios({
      method: 'post',
      headers: headers,
      url: endpoint,
      data: querystring.stringify({ query }),
    });
    if (resultFormat === 'json') {
      return resultMapper(response.data.results.bindings);
    } else {
      return response.data;
    }

  } catch(error) {
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
      console.log(error.response.data);
    //console.log(error.response.status);
    //console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
    // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
};
