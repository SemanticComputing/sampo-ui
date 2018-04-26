import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import reducer from './reducers';
import rootEpic from './epics';

import App from './components/App';

const store = createStore(
  reducer,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(createEpicMiddleware(rootEpic))
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
