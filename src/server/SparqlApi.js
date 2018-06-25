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
        fetch('http://vocab.getty.edu/sparql.json?query=select*{?s+a+gvp:Facet;skos:inScheme+aat:;gvp:prefLabelGVP/xl:literalForm?label}')
          .then(response => { return response.text();})
          .then(responseData => {
            console.log(responseData);
            return resolve(responseData);
          })
          .catch(error => console.log('error is', error));
      }
      //
      // fetch('http://vocab.getty.edu/sparql.json',
      //   { method: 'POST',
      //     body: 'query=' + query,
      //   })
      //   .then(res => {
      //     return res.json()
      //     //res.text();
      //   })
      //   .then(data => console.log('data is', data))
      //   .catch(error => console.log('error is', error));

      // The res.text property contains the unparsed response body string. This
      // property is always present for the client API, and only when the mime type
      //  matches "text/", "/json", or "x-www-form-urlencoded" by default for node.
      //  The reasoning is to conserve memory, as buffering text of
      //  large bodies such as multipart files or images is extremely inefficient.
      //  To force buffering see the "Buffering responses" section

      request.post(this.endpoint)
        .send({ query })
        .set(headers)
        .end((err, res) => {
          //console.log(res.headers);
          //console.log(res.body);
          //console.log(res.text);
          //console.log(res.req.rawHeaders)
          if (err || !res.ok) return reject(err);
          //return(resolve(JSON.stringify(test)));
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
