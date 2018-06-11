import request from 'superagent';

const defaultSelectHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/sparql-results+json'
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
      request.post(this.endpoint)
        .send({ query })
        .set(headers)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);
          return resolve(res.text);
        });
    });
  }

  selectQuery(query, params = { headers: defaultSelectHeaders }) {
    return this.query(query, params).then((data) => JSON.parse(data));
  }

  constructQuery(query, params = { headers: defaultConstructHeaders }) {
    return this.query(query, params);
  }

}

export default SparqlApi;
