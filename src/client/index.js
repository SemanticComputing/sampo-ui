import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
//import {responsiveStoreEnhancer} from 'redux-responsive';
import { Provider } from 'react-redux';
import ReduxToastr, { actions as toastrActions } from 'react-redux-toastr';
import { Router } from 'react-router-dom';
import history from './History';
import reducer from './reducers';
import rootEpic from './epics';
import App from './components/App';

import 'react-sortable-tree/style.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

const epicMiddleware = createEpicMiddleware();

const middleware = applyMiddleware(epicMiddleware);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  compose(
    //responsiveStoreEnhancer,
    composeEnhancers(middleware)
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
        timeOut={0}
        newestOnTop={false}
        preventDuplicates
        position="top-center"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
      />
    </div>
  </Provider>,
  document.getElementById('root')
);
