import request from 'superagent';
import fetch from 'node-fetch';

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

      if (this.endpoint === 'http://vocab.getty.edu/sparql.json') {
        const url = this.endpoint + '?query=' + query;
        fetch(url)
          .then(response => {
            return response.json();
          })
          .then(responseData => {
            return resolve(responseData);
          })
          .catch(error => console.log('error is', error));
      } else {
        request.post(this.endpoint)
          .send({ query })
          .set(headers)
          .end((err, res) => {
            if (err || !res.ok) return reject(err);
            return resolve(res.text);
          });
      }
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
