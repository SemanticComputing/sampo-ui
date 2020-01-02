import axios from 'axios';

export const runNetworkQuery = async({
  endpoint,
  prefixes,
  links,
  nodes
}) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const params = JSON.stringify({
    endpoint,
    prefixes,
    nodes,
    links
  });
  try {
    const response = await axios({
      method: 'post',
      headers: headers,
      url: 'http://127.0.0.1:5000/query',
      data: params,
    });
    return response.data;
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
;
