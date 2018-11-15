import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import {responsiveStoreEnhancer} from 'redux-responsive';
import createRootReducer from './reducers';
import rootEpic from './epics';
import ReduxToastr from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import { actions as toastrActions } from 'react-redux-toastr';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import App from './components/App';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-virtualized/styles.css';

const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history), // root reducer with router state
  compose(
    responsiveStoreEnhancer,
    applyMiddleware(
      createEpicMiddleware(rootEpic),
      routerMiddleware(history)
    )
  )
);

bindActionCreators(toastrActions, store.dispatch);

render(
  <Provider store={store}>
    <div id='app'>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
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
