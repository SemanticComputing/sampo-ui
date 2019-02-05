import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import {responsiveStoreEnhancer} from 'redux-responsive';
import { Provider } from 'react-redux';
import ReduxToastr, { actions as toastrActions } from 'react-redux-toastr';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-virtualized/styles.css';

import reducer from './reducers';
import rootEpic from './epics';
import App from './components/App';

const epicMiddleware = createEpicMiddleware();
const history = createBrowserHistory();

const store = createStore(
  reducer,
  compose(
    responsiveStoreEnhancer,
    applyMiddleware(
      epicMiddleware,
    )
  )
);

epicMiddleware.run(rootEpic);

bindActionCreators(toastrActions, store.dispatch);

render(
  <Provider store={store}>
    <div id='app'>
      <Router history={history}>
        <App />
      </Router>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="top-center"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
      />
    </div>
  </Provider>,
  document.getElementById('root')
);
