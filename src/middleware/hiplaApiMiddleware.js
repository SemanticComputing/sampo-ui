import { startSpinner, updateResults } from '../actions';
import request from 'superagent';

const hiplaApiMiddleware = () => {

  const searchUrl = 'http://localhost:3000/search';

  const getResults = (store) => {
    const { query, datasets } = store.getState().search;
    if (query.length < 3) {
      return store.dispatch(updateResults([]));
    }

    console.log('query:', query);
    console.log('datasets:', datasets);
    return request(searchUrl)
      .query({ q: query})
      .query({ dataset: datasets})
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return store.dispatch(updateResults(response.body));
      });
  };

  // A Redux middleware
  return store => next => action => {
    switch(action.type) {
      case 'FETCH_RESULTS':
        console.log('action: FETCH_RESULTS');

        store.dispatch(startSpinner);
        next(action);
        return getResults(store);

      default:
        return next(action);
    }
  };
};

export default hiplaApiMiddleware;
