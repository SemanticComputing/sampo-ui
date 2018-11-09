import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import {responsiveStoreEnhancer} from 'redux-responsive';
import reducer from './reducers';
import rootEpic from './epics';
import ReduxToastr from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import { actions as toastrActions } from 'react-redux-toastr';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './components/App';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-virtualized/styles.css';

const store = createStore(
  reducer,
  compose(
    responsiveStoreEnhancer,
    applyMiddleware(createEpicMiddleware(rootEpic))
  )
);

bindActionCreators(toastrActions, store.dispatch);

render(
  <Provider store={store}>
    <div id='app'>
      <Router>
        <Route path="/:filter?" component={App} />
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
