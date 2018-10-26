//import request from 'superagent';
import fetch from 'node-fetch';
const { URLSearchParams } = require('url');

const defaultSelectHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/sparql-results+json; charset=utf-8'
};
const defaultConstructHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'text/turtle'
};

class SparqlApi {

  constructor({ endpoint }) {
    this.endpoint = endpoint;
  }

  query(query, { headers }) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append('query', query);
      fetch(this.endpoint, {
        method: 'post',
        body:    params,
        headers: headers,
      })
        .then(res => res.text())
        .then(data => {
          return resolve(data);
        })
        .catch(error => console.log('error is', error));
      // if (this.endpoint === 'http://vocab.getty.edu/sparql.json') {
      //   const url = this.endpoint + '?query=' + query;
      //   fetch(url)
      //     .then(response => {
      //       return response.json();
      //     })
      //     .then(responseData => {
      //       return resolve(responseData);
      //     })
      //     .catch(error => console.log('error is', error));
      // } else {
      //   const body = { query: query};
      //   request.post(this.endpoint)
      //     .send(body)
      //     .set(headers)
      //     .end((err, res) => {
      //       if (err || !res.ok) return reject(err);
      //       return resolve(res.text);
      //     });
      // }
    });
  }

  selectQuery(query, params = { headers: defaultSelectHeaders }) {
    return this.query(query, params).then((data) => {
      if (this.endpoint === 'http://vocab.getty.edu/sparql.json') {
        return(data);
      } else {
        return JSON.parse(data);
      }
    });
  }

  constructQuery(query, params = { headers: defaultConstructHeaders }) {
    return this.query(query, params);
  }
}

export default SparqlApi;
