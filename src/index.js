import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
// import { logger, crashReporter } from './middleware/crashReporter';
import hiplaApiMiddleware from './middleware/hiplaApiMiddleware';
import createDebounce from 'redux-debounced';

import App from './components/App';

const store = createStore(
  reducer,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(thunk, createDebounce(), hiplaApiMiddleware())
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
